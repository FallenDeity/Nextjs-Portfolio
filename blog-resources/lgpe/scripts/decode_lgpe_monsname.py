#!/usr/bin/env python3
"""Decode LGPE English monsname entries and correlate present pm GFPAKs by numeric index."""

import argparse
import csv
import hashlib
import re
import struct
import sys
from collections import defaultdict
from pathlib import Path


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_ahtb(path):
    data = path.read_bytes()
    if len(data) < 8 or data[:4] != b"AHTB":
        raise ValueError("{}: expected AHTB signature".format(path))
    count = struct.unpack_from("<I", data, 4)[0]
    labels = []
    pos = 8
    for index in range(count):
        if pos + 10 > len(data):
            raise ValueError("{}: truncated AHTB record {}".format(path, index))
        length = struct.unpack_from("<H", data, pos + 8)[0]
        end = pos + 10 + length
        if length < 1 or end > len(data):
            raise ValueError("{}: invalid AHTB record {}".format(path, index))
        labels.append(data[pos + 10 : end - 1].decode("ascii"))
        pos = end
    return labels, pos, len(data)


def parse_text_dat(path):
    data = path.read_bytes()
    if len(data) < 20:
        raise ValueError("{}: too short for the TextFile header".format(path))
    section_count, line_count = struct.unpack_from("<HH", data, 0)
    total_length = struct.unpack_from("<I", data, 4)[0]
    initial_key = struct.unpack_from("<I", data, 8)[0]
    section_data_offset = struct.unpack_from("<I", data, 12)[0]
    if section_count != 1:
        raise ValueError("{}: expected one text section, found {}".format(path, section_count))
    if initial_key != 0:
        raise ValueError("{}: unsupported initial-key field 0x{:08x}".format(path, initial_key))
    if section_data_offset + total_length != len(data):
        raise ValueError("{}: section offset + length does not match file size".format(path))
    section_length = struct.unpack_from("<I", data, section_data_offset)[0]
    if section_length != total_length:
        raise ValueError("{}: section length differs from header total length".format(path))
    descriptor_base = section_data_offset + 4
    if descriptor_base + line_count * 8 > len(data):
        raise ValueError("{}: descriptor table extends beyond file".format(path))

    rows = []
    key = 0x7C89
    for index in range(line_count):
        descriptor = descriptor_base + index * 8
        relative, length, flags = struct.unpack_from("<iHH", data, descriptor)
        if relative < 0:
            raise ValueError("{}: line {} has negative relative offset".format(path, index))
        payload_offset = section_data_offset + relative
        payload_size = length * 2
        if payload_offset + payload_size > len(data):
            raise ValueError("{}: line {} extends beyond file".format(path, index))
        current_key, chars, terminated = key, [], False
        for char_index in range(length):
            value = struct.unpack_from("<H", data, payload_offset + char_index * 2)[0] ^ current_key
            current_key = ((current_key << 3) | (current_key >> 13)) & 0xFFFF
            if value == 0:
                terminated = True
                break
            if value == 0x10:
                raise ValueError("{}: line {} contains unsupported 0x0010 control text".format(path, index))
            chars.append(chr(value))
        if not terminated:
            raise ValueError("{}: line {} has no decoded zero terminator".format(path, index))
        rows.append(
            dict(
                text="".join(chars),
                relative=relative,
                length=length,
                flags=flags,
                payload_offset=payload_offset,
                payload_size=payload_size,
            )
        )
        key = (key + 0x2983) & 0xFFFF

    header = dict(
        section_count=section_count,
        line_count=line_count,
        total_length=total_length,
        initial_key=initial_key,
        section_data_offset=section_data_offset,
        section_length=section_length,
        descriptor_base=descriptor_base,
    )
    return data, header, rows


def decode_dat(path):
    _data, _header, rows = parse_text_dat(path)
    return [row["text"] for row in rows]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "dump_root",
        nargs="?",
        type=Path,
        default=Path("."),
        help="extracted LGPE dump root (default: current directory)",
    )
    parser.add_argument("--out", type=Path, help="write TSV here; omit to print TSV to stdout")
    parser.add_argument("--force", action="store_true", help="allow replacing an existing output")
    args = parser.parse_args()

    common = args.dump_root / "romfs/bin/message/English/common"
    dat_path = common / "monsname.dat"
    tbl_path = common / "monsname.tbl"
    pak_dir = args.dump_root / "romfs/bin/archive/pokemon"

    try:
        names = decode_dat(dat_path)
        labels, parsed_end, tbl_size = read_ahtb(tbl_path)
        forms_by_id = defaultdict(set)
        if pak_dir.is_dir():
            for pak in pak_dir.glob("pm*.gfpak"):
                match = re.fullmatch(r"pm(\d{4})_(\d{2})(?:_(\d{2}))?", pak.stem)
                if match:
                    model_id, form = (int(value) for value in match.group(1, 2))
                    forms_by_id[model_id].add(form)

        if args.out and args.out.exists() and not args.force:
            raise FileExistsError("{} exists; pass --force to replace it".format(args.out))
        if args.out:
            args.out.parent.mkdir(parents=True, exist_ok=True)
            writer_output = args.out.open("w", encoding="utf-8", newline="")
        else:
            writer_output = sys.stdout
        try:
            writer = csv.writer(writer_output, delimiter="\t", lineterminator="\n")
            writer.writerow(("name_index", "label", "english_name", "pm_id_in_archive", "pak_form_suffixes"))
            for index, name in enumerate(names):
                model_id = "pm{:04d}".format(index) if index in forms_by_id else ""
                forms = ",".join("{:02d}".format(value) for value in sorted(forms_by_id[index]))
                label = labels[index] if index < len(labels) else ""
                writer.writerow((index, label, name, model_id, forms))
        finally:
            if args.out:
                writer_output.close()

        if args.out:
            print("Wrote {}".format(args.out))
        print(
            "DAT entries: {}; TBL labels: {}; labels beyond DAT: {}".format(
                len(names), len(labels), max(0, len(labels) - len(names))
            ),
            file=sys.stderr,
        )
        print("DAT SHA-256: {}".format(sha256(dat_path)), file=sys.stderr)
        print("TBL SHA-256: {}".format(sha256(tbl_path)), file=sys.stderr)
        if len(names) > 6:
            label6 = labels[6] if len(labels) > 6 else "[missing label]"
            print("Check: index 6 = {} = {}".format(label6, names[6]), file=sys.stderr)
        matched = sum(1 for index in forms_by_id if index < len(names))
        outside = sorted(index for index in forms_by_id if index >= len(names))
        print("pm IDs joined to same-number name indexes: {}".format(matched), file=sys.stderr)
        if outside:
            print(
                "pm IDs with no DAT index: {}".format(", ".join("pm{:04d}".format(i) for i in outside)), file=sys.stderr
            )
        print("Form suffixes come from GFPAK filenames; this script does not name the forms.", file=sys.stderr)
        print("AHTB parse ended at 0x{:x} of 0x{:x} bytes.".format(parsed_end, tbl_size), file=sys.stderr)
    except (OSError, ValueError, struct.error) as exc:
        parser.error(str(exc))


if __name__ == "__main__":
    main()
