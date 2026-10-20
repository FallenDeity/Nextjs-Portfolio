#!/usr/bin/env python3
"""Extract and inspect LGPE GFPAK entries using the archive table and LZ4 blocks.

Install the dependency with: python -m pip install lz4
"""

import argparse
import pathlib
import struct
import zlib

try:
    import lz4.block
except ImportError:
    raise SystemExit("Missing dependency: python -m pip install lz4")

FNV_OFFSET = 0xCBF29CE484222645
FNV_PRIME = 0x100000001B3


def fnv64a1(text):
    value = FNV_OFFSET
    for byte in text.encode("ascii"):
        value = ((value ^ byte) * FNV_PRIME) & 0xFFFFFFFFFFFFFFFF
    return value


def read_dotnet_string(data, offset):
    length = shift = 0
    while True:
        byte = data[offset]
        offset += 1
        length |= (byte & 0x7F) << shift
        if byte < 0x80:
            break
        shift += 7
    end = offset + length
    return data[offset:end].decode("utf-8"), end


def read_hash_cache(path):
    names = {}
    if path is None or not path.is_file():
        return names
    data = path.read_bytes()
    count = struct.unpack_from("<I", data, 8)[0]
    offset = 12
    for _ in range(count):
        code = struct.unpack_from("<Q", data, offset)[0]
        offset += 8
        name, offset = read_dotnet_string(data, offset)
        names[code] = name
    return names


def get_field(data, table, slot):
    vtable = table - struct.unpack_from("<i", data, table)[0]
    vtable_size = struct.unpack_from("<H", data, vtable)[0]
    location = vtable + 4 + slot * 2
    if location + 2 > vtable + vtable_size:
        return 0
    field_offset = struct.unpack_from("<H", data, location)[0]
    return table + field_offset if field_offset else 0


def indirect(data, location):
    return location + struct.unpack_from("<I", data, location)[0] if location else 0


def flatbuffer_string(data, location):
    if not location:
        return None
    target = indirect(data, location)
    length = struct.unpack_from("<I", data, target)[0]
    return data[target + 4 : target + 4 + length].decode("utf-8")


def animation_references(data):
    """Read AnimationConfig.Animations[].{Name,File} from the GFANMCFG FlatBuffer."""
    root = struct.unpack_from("<I", data, 0)[0]
    animations_field = get_field(data, root, 6)
    animation_list = indirect(data, animations_field)
    vector_field = get_field(data, animation_list, 0)
    vector = indirect(data, vector_field)
    count = struct.unpack_from("<I", data, vector)[0]
    result = []
    for index in range(count):
        item_location = vector + 4 + index * 4
        item = indirect(data, item_location)
        name = flatbuffer_string(data, get_field(data, item, 0))
        filename = flatbuffer_string(data, get_field(data, item, 1))
        if name and filename:
            result.append((name, filename))
    return result


def extension(data):
    for signature, ext in (
        (b"SARC", ".szs"),
        (b"Yaz", ".szs"),
        (b"FRES", ".bfres"),
        (b"Gfx2", ".gtx"),
        (b"FLYT", ".bflyt"),
        (b"VFXB", ".ptcl"),
        (b"AAHS", ".sharc"),
        (b"BAHS", ".sharcb"),
        (b"BNTX", ".bntx"),
        (b"BNSH", ".bnsh"),
        (b"FSHA", ".bfsha"),
        (b"MsgStdBn", ".msbt"),
    ):
        if data.startswith(signature):
            return ext
    if len(data) >= 4:
        value = struct.unpack_from("<I", data)[0]
        return {4: ".gfbanm", 20: ".gfbanm", 24: ".gfbanmcfg", 32: ".gfbmdl", 68: ".gfbpokecfg"}.get(value, "")
    return ""


def embedded_name(data):
    if len(data) < 20:
        return None
    offset = struct.unpack_from("<I", data, 0x10)[0]
    if not 0 < offset < len(data):
        return None
    end = data.find(b"\0", offset)
    if end < 0:
        return None
    try:
        return data[offset:end].decode("utf-8")
    except UnicodeDecodeError:
        return None


def read_archive(path):
    data = path.read_bytes()
    if data[:8] != b"GFLXPACK":
        raise ValueError("Expected GFLXPACK signature at offset 8")
    file_count, folder_count = struct.unpack_from("<II", data, 16)
    file_info, hash_array, folder_array = struct.unpack_from("<QQQ", data, 24)

    index_names = {}
    offset = folder_array
    for _ in range(folder_count):
        folder_hash, count, _padding = struct.unpack_from("<QII", data, offset)
        offset += 16
        for _ in range(count):
            file_hash, index, _padding = struct.unpack_from("<QiI", data, offset)
            offset += 16
            index_names[index] = (folder_hash, file_hash)

    entries = []
    for index in range(file_count):
        level, compression, unpacked_size, packed_size, _padding, data_offset = struct.unpack_from(
            "<HHIIIQ", data, file_info + index * 24
        )
        raw = data[data_offset : data_offset + packed_size]
        if compression == 2:
            raw = lz4.block.decompress(raw, uncompressed_size=unpacked_size)
        elif compression == 1:
            raw = zlib.decompress(raw)
        elif compression == 0:
            pass
        else:
            raise ValueError("Unsupported compression type {} at entry {}".format(compression, index))
        if len(raw) != unpacked_size:
            raise ValueError("Entry {} size mismatch: expected {}, got {}".format(index, unpacked_size, len(raw)))
        folder_hash, file_hash = index_names[index]
        entries.append(
            {
                "index": index,
                "folder_hash": folder_hash,
                "file_hash": file_hash,
                "data": raw,
                "extension": extension(raw),
                "size": unpacked_size,
            }
        )

    names = {}
    for entry in entries:
        if entry["extension"] != ".gfbanmcfg":
            continue
        for _name, filename in animation_references(entry["data"]):
            names[fnv64a1(filename)] = filename

    return entries, names


def safe_relative_path(name):
    path = pathlib.PurePosixPath(name.replace("\\", "/").strip("/"))
    if path.is_absolute() or any(part in ("", ".", "..") for part in path.parts):
        raise ValueError("Unsafe archive path: {}".format(name))
    return pathlib.Path(*path.parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=pathlib.Path)
    parser.add_argument("--out", type=pathlib.Path, help="destination directory; omit to list entries")
    parser.add_argument("--hash-cache", type=pathlib.Path, help="optional Switch-Toolbox GFPAKHashCache.bin")
    parser.add_argument("--animations", action="store_true", help="print config-to-animation references")
    args = parser.parse_args()

    try:
        entries, dynamic_names = read_archive(args.archive)
        names = read_hash_cache(args.hash_cache)
        names.update(dynamic_names)
        counts = {}
        for entry in entries:
            ext = entry["extension"] or "[unknown]"
            counts[ext] = counts.get(ext, 0) + 1

        print("{}: {} files".format(args.archive.name, len(entries)))
        print("Types: " + ", ".join("{} {}".format(count, ext) for ext, count in sorted(counts.items())))
        if args.animations:
            for entry in entries:
                if entry["extension"] != ".gfbanmcfg":
                    continue
                config_name = names.get(entry["file_hash"], "{:016X}.gfbanmcfg".format(entry["file_hash"]))
                for animation_name, filename in animation_references(entry["data"]):
                    print(
                        "ANIMCFG {}: {} -> {} (hash {:016X})".format(
                            config_name, animation_name, filename, fnv64a1(filename)
                        )
                    )

        if args.out:
            for entry in entries:
                ext = entry["extension"]
                base_name = names.get(entry["file_hash"])
                if not base_name and ext in (".bntx", ".bnsh", ".bfres", ".bfsha"):
                    base_name = embedded_name(entry["data"])
                    if base_name and ext == ".bnsh":
                        vsh = fnv64a1(base_name + ".bnsh_vsh") == entry["file_hash"]
                        fsh = fnv64a1(base_name + ".bnsh_fsh") == entry["file_hash"]
                        if vsh:
                            base_name += ".bnsh_vsh"
                        elif fsh:
                            base_name += ".bnsh_fsh"
                if not base_name:
                    base_name = "{:016X}{}".format(entry["file_hash"], ext)
                folder = names.get(entry["folder_hash"], "{:016X}".format(entry["folder_hash"]))
                output = args.out / safe_relative_path(folder) / safe_relative_path(base_name)
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(entry["data"])
            print("Extracted to {}".format(args.out.resolve()))
    except (OSError, ValueError, struct.error, IndexError) as error:
        parser.error(str(error))


if __name__ == "__main__":
    main()
