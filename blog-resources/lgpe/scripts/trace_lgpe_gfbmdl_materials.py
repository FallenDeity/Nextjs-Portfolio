#!/usr/bin/env python3
"""Resolve LGPE GFBMDL material texture indices and named shader parameters."""

import argparse
import hashlib
import json
import struct
from pathlib import Path


def u16(data, at):
    return struct.unpack_from("<H", data, at)[0]


def u32(data, at):
    return struct.unpack_from("<I", data, at)[0]


def i32(data, at):
    return struct.unpack_from("<i", data, at)[0]


def table_field(data, table, slot):
    if not table:
        return 0
    vtable = table - i32(data, table)
    vtable_size = u16(data, vtable)
    entry = vtable + 4 + slot * 2
    if entry + 2 > vtable + vtable_size:
        return 0
    field_offset = u16(data, entry)
    return table + field_offset if field_offset else 0


def indirect(data, at):
    return at + u32(data, at) if at else 0


def string_at(data, at):
    if not at:
        return None
    target = indirect(data, at)
    length = u32(data, target)
    return data[target + 4 : target + 4 + length].decode("utf-8")


def string_field(data, table, slot):
    return string_at(data, table_field(data, table, slot))


def vector_items(data, table, slot):
    field = table_field(data, table, slot)
    if not field:
        return []
    vector = indirect(data, field)
    count = u32(data, vector)
    return [vector + 4 + index * 4 for index in range(count)]


def vector_strings(data, table, slot):
    return [string_at(data, item) for item in vector_items(data, table, slot)]


def named_values(data, refs, value_type):
    values = {}
    for ref in refs:
        item = indirect(data, ref)
        name = string_field(data, item, 0)
        value_field = table_field(data, item, 1)
        if not name or not value_field:
            continue
        if value_type == "float":
            value = struct.unpack_from("<f", data, value_field)[0]
        elif value_type == "int":
            value = i32(data, value_field)
        else:
            value = bool(data[value_field])
        values[name] = value
    return values


def named_colors(data, refs):
    colors = {}
    for ref in refs:
        item = indirect(data, ref)
        name = string_field(data, item, 0)
        color_field = table_field(data, item, 1)
        if name and color_field:
            colors[name] = list(struct.unpack_from("<fff", data, color_field))
    return colors


def material_report(data, table, texture_names, index):
    textures = []
    wrap_names = {0: "Repeat", 1: "Clamp", 2: "Mirror"}
    for ref in vector_items(data, table, 11):
        item = indirect(data, ref)
        sampler = string_field(data, item, 0)
        index_field = table_field(data, item, 1)
        texture_index = i32(data, index_field) if index_field else 0
        params_field = table_field(data, item, 2)
        params = indirect(data, params_field) if params_field else 0
        if params:
            wrap_x_field = table_field(data, params, 1)
            wrap_y_field = table_field(data, params, 2)
            wrap_x = u32(data, wrap_x_field) if wrap_x_field else 0
            wrap_y = u32(data, wrap_y_field) if wrap_y_field else 0
            wrap_source = "TextureMaps.Params"
        else:
            # GFLXModel initializes S=Mirror, T=Repeat before applying Params.
            wrap_x, wrap_y = 2, 0
            wrap_source = "renderer default; Params absent"
        textures.append(
            {
                "sampler": sampler,
                "texture_index": texture_index,
                "texture_name": texture_names[texture_index] if 0 <= texture_index < len(texture_names) else None,
                "wrap_u": wrap_names.get(wrap_x, "Unknown({})".format(wrap_x)),
                "wrap_v": wrap_names.get(wrap_y, "Unknown({})".format(wrap_y)),
                "wrap_source": wrap_source,
            }
        )

    common_field = table_field(data, table, 20)
    common = {}
    if common_field:
        common_table = indirect(data, common_field)
        common = {
            "switches": named_values(data, vector_items(data, common_table, 0), "bool"),
            "values": named_values(data, vector_items(data, common_table, 1), "int"),
            "colors": named_colors(data, vector_items(data, common_table, 2)),
        }

    return {
        "index": index,
        "name": string_field(data, table, 0),
        "shader_group": string_field(data, table, 1),
        "textures": textures,
        "switches": named_values(data, vector_items(data, table, 12), "bool"),
        "values": named_values(data, vector_items(data, table, 13), "float"),
        "colors": named_colors(data, vector_items(data, table, 14)),
        "common": common,
    }


def parse_model(path):
    data = path.read_bytes()
    if len(data) < 8 or u32(data, 0) >= len(data):
        raise ValueError("Input does not look like a GFBMDL FlatBuffer")
    root = u32(data, 0)
    texture_names = vector_strings(data, root, 2)
    materials = [
        material_report(data, indirect(data, ref), texture_names, index)
        for index, ref in enumerate(vector_items(data, root, 6))
    ]
    return {
        "source": str(path.resolve()),
        "sha256": hashlib.sha256(data).hexdigest(),
        "size": len(data),
        "version": u32(data, table_field(data, root, 0)) if table_field(data, root, 0) else 0,
        "texture_names": texture_names,
        "materials": materials,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("gfbmdl", type=Path)
    parser.add_argument("--material", help="case-insensitive material name filter")
    parser.add_argument("--out", type=Path, help="write JSON report; omit to print JSON")
    parser.add_argument("--force", action="store_true", help="overwrite an existing report")
    args = parser.parse_args()
    try:
        report = parse_model(args.gfbmdl)
        if args.material:
            needle = args.material.casefold()
            report["materials"] = [m for m in report["materials"] if needle in m["name"].casefold()]
        output = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
        if args.out:
            if args.out.exists() and not args.force:
                raise FileExistsError(f"Refusing to overwrite {args.out}; pass --force")
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_text(output, encoding="utf-8")
            print(f"Wrote {args.out}")
            print(f"GFBMDL SHA-256: {report['sha256']}")
            print(f"Texture names: {len(report['texture_names'])}; materials: {len(report['materials'])}")
        else:
            print(output, end="")
    except (OSError, ValueError, struct.error, IndexError) as error:
        parser.error(str(error))


if __name__ == "__main__":
    main()
