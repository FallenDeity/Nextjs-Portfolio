#!/usr/bin/env python3
"""Decode LGPE GFBANM tracks and render Charizard's skeleton study figures.

Requires NumPy and Pillow. Pass the model, body animation, material loop, and
one extracted flame texture path to identify the folder used in the report.
Rendered mesh and flame captures are assembled by the companion script.
"""

import argparse
import json
import math
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


def u8(data, at):
    return data[at]


def u16(data, at):
    return struct.unpack_from("<H", data, at)[0]


def i16(data, at):
    return struct.unpack_from("<h", data, at)[0]


def u32(data, at):
    return struct.unpack_from("<I", data, at)[0]


def i32(data, at):
    return struct.unpack_from("<i", data, at)[0]


def f32(data, at):
    return struct.unpack_from("<f", data, at)[0]


def field(data, table, slot):
    if not table:
        return 0
    vtable = table - i32(data, table)
    size = u16(data, vtable)
    pos = vtable + 4 + slot * 2
    if pos + 2 > vtable + size:
        return 0
    off = u16(data, pos)
    return table + off if off else 0


def indirect(data, pos):
    return pos + u32(data, pos) if pos else 0


def vec(data, table, slot):
    at = field(data, table, slot)
    if not at:
        return []
    start = indirect(data, at)
    count = u32(data, start)
    return [start + 4 + i * 4 for i in range(count)]


def string(data, table, slot):
    at = field(data, table, slot)
    if not at:
        return ""
    start = indirect(data, at)
    length = u32(data, start)
    return data[start + 4 : start + 4 + length].decode("utf-8", "replace")


def struct3(data, table, slot, default):
    at = field(data, table, slot)
    return np.array(struct.unpack_from("<fff", data, at), dtype=float) if at else np.array(default, dtype=float)


def table_root(data):
    if len(data) < 4:
        raise ValueError("Truncated FlatBuffer")
    root = u32(data, 0)
    if root >= len(data):
        raise ValueError("Invalid FlatBuffer root")
    return root


def read_model(path):
    return read_model_data(path.read_bytes())


def read_model_data(data):
    root = table_root(data)
    bones = []
    for ref in vec(data, root, 9):
        bone = indirect(data, ref)
        p_at = field(data, bone, 2)
        parent = i32(data, p_at) if p_at else -1
        bones.append(
            {
                "name": string(data, bone, 0),
                "parent": parent,
                "scale": struct3(data, bone, 5, (1, 1, 1)),
                "rotation": struct3(data, bone, 6, (0, 0, 0)),
                "translation": struct3(data, bone, 7, (0, 0, 0)),
            }
        )
    if not bones:
        raise ValueError("No GFBMDL bones found at the expected field")
    return bones


def enum_scalar(data, table, slot, default=0):
    at = field(data, table, slot)
    return u8(data, at) if at else default


def read_vec3_values(data, table, slot):
    at = field(data, table, slot)
    if not at:
        return []
    start = indirect(data, at)
    count = u32(data, start)
    return [np.array(struct.unpack_from("<fff", data, start + 4 + i * 12), dtype=float) for i in range(count)]


def read_quat_values(data, table, slot):
    at = field(data, table, slot)
    if not at:
        return []
    start = indirect(data, at)
    count = u32(data, start)
    return [tuple(struct.unpack_from("<HHH", data, start + 4 + i * 6)) for i in range(count)]


def read_frames(data, table, slot, width):
    at = field(data, table, slot)
    if not at:
        return []
    start = indirect(data, at)
    count = u32(data, start)
    fmt = "<" + ("H" if width == 2 else "B") * count
    return list(struct.unpack_from(fmt, data, start + 4)) if count else []


def vector_track(data, kind, table):
    if not table or kind == 0:
        return []
    if kind == 1:
        at = field(data, table, 0)
        return [np.array(struct.unpack_from("<fff", data, at), dtype=float)] if at else []
    if kind == 2:
        return read_vec3_values(data, table, 0)
    if kind in (3, 4):
        vals = read_vec3_values(data, table, 1)
        frames = read_frames(data, table, 0, 2 if kind == 3 else 1)
        return list(zip(frames if frames else range(len(vals)), vals))
    return []


def quat_track(data, kind, table):
    if not table or kind == 0:
        return []
    if kind == 1:
        at = field(data, table, 0)
        return [(0, tuple(struct.unpack_from("<HHH", data, at)))] if at else []
    if kind == 2:
        return list(enumerate(read_quat_values(data, table, 0)))
    if kind in (3, 4):
        vals = read_quat_values(data, table, 1)
        frames = read_frames(data, table, 0, 2 if kind == 3 else 1)
        return list(zip(frames if frames else range(len(vals)), vals))
    return []


def track_at(track, frame, quat=False):
    if not track:
        return None
    if not quat:
        keys = (
            [(float(f), np.asarray(v, dtype=float)) for f, v in track]
            if isinstance(track[0], tuple) and len(track[0]) == 2 and np.isscalar(track[0][0])
            else [(float(i), np.asarray(v, dtype=float)) for i, v in enumerate(track)]
        )
        if len(keys) == 1 or frame <= keys[0][0]:
            return keys[0][1]
        if frame >= keys[-1][0]:
            return keys[-1][1]
        for (fa, a), (fb, b) in zip(keys, keys[1:]):
            if fa <= frame <= fb:
                t = 0.0 if fb == fa else (frame - fa) / (fb - fa)
                return a * (1 - t) + b * t
    return None


def unpack_quat(words):
    # GFBANM.cs calls PackedToQuat(value.X, value.Y, value.Z), while that
    # method's formal arguments are named (z, y, x) and packs x:y:z.
    z, y, x = (int(w) & 0xFFFF for w in words)
    packed = (x << 32) | (y << 16) | z
    extra = packed & 7
    value = packed >> 3

    def unpack_s15(v):
        v &= 0x7FFF
        sign = (v >> 14) & 1
        v &= 0x3FFF
        if sign == 0:
            v -= 0x4000
        return v

    a = unpack_s15((value >> 30) & 0x7FFF)
    b = unpack_s15((value >> 15) & 0x7FFF)
    c = unpack_s15(value & 0x7FFF)
    scale = 1.0 / (0x399E * math.sqrt(2.0))
    xyz = np.array([a, b, c], dtype=float) * scale
    w = math.sqrt(max(0.0, 1.0 - float(xyz @ xyz)))
    q = [w, xyz[0], xyz[1], xyz[2]]
    # The C# reader passes the swizzled tuple to OpenTK Quaternion(x,y,z,w).
    # Convert that constructor order back to the conventional (w,x,y,z) used here.
    xyzw = [q[i] for i in ((0, 3, 2, 1), (3, 0, 2, 1), (3, 2, 0, 1), (3, 2, 1, 0))[extra & 3]]
    q = np.array([xyzw[3], xyzw[0], xyzw[1], xyzw[2]])
    if extra >> 2:
        q *= -1
    return q / max(np.linalg.norm(q), 1e-12)


def quat_slerp(a, b, t):
    dot = float(a @ b)
    if dot < 0:
        b, dot = -b, -dot
    dot = min(1.0, max(-1.0, dot))
    if dot > 0.9995:
        q = a + t * (b - a)
        return q / np.linalg.norm(q)
    theta = math.acos(dot)
    return (math.sin((1 - t) * theta) * a + math.sin(t * theta) * b) / math.sin(theta)


def quat_matrix(q):
    w, x, y, z = q
    return np.array(
        [
            [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
            [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
            [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
        ]
    )


def euler_matrix(e):
    x, y, z = e
    cx, cy, cz = np.cos(e)
    sx, sy, sz = np.sin(e)
    rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return rz @ ry @ rx


def read_animation(path):
    return read_animation_data(path.read_bytes())


def read_animation_data(data):
    root = table_root(data)
    cfg = indirect(data, field(data, root, 0))
    keyframes = u32(data, field(data, cfg, 1)) if field(data, cfg, 1) else 0
    fps = u32(data, field(data, cfg, 2)) if field(data, cfg, 2) else 0
    bones_list = indirect(data, field(data, root, 1))
    anim_tracks = {}
    bone_refs = vec(data, bones_list, 0) if bones_list else []
    for ref in bone_refs:
        bone = indirect(data, ref)
        name = string(data, bone, 0)
        st, rt, tt = enum_scalar(data, bone, 1), enum_scalar(data, bone, 3), enum_scalar(data, bone, 5)
        scale = vector_track(data, st, indirect(data, field(data, bone, 2)))
        rotation = quat_track(data, rt, indirect(data, field(data, bone, 4)))
        translate = vector_track(data, tt, indirect(data, field(data, bone, 6)))
        anim_tracks[name] = {"scale": scale, "rotation": rotation, "translation": translate}
    return data, keyframes, fps, anim_tracks


def read_vec3_track(data, kind, track_table):
    return vector_track(data, kind, track_table)


def parse_materials(data, root):
    matlist = indirect(data, field(data, root, 2))
    out = {}
    for ref in vec(data, matlist, 0) if matlist else []:
        mat = indirect(data, ref)
        name = string(data, mat, 0)
        vectors = {}
        for vref in vec(data, mat, 3):
            item = indirect(data, vref)
            n = string(data, item, 0)
            kind = enum_scalar(data, item, 1)
            track = indirect(data, field(data, item, 2))
            vectors[n] = read_vec3_track(data, kind, track)
        values = {}
        for vref in vec(data, mat, 2):
            item = indirect(data, vref)
            n = string(data, item, 0)
            kind = enum_scalar(data, item, 1)
            track = indirect(data, field(data, item, 2))
            if kind == 1:
                at = field(data, track, 0)
                vals = [(0, f32(data, at))] if at else []
            elif kind == 2:
                vals = list(enumerate(read_float_values(data, track, 0)))
            elif kind == 3:
                vals = list(zip(read_frames(data, track, 0, 2), read_float_values(data, track, 1)))
            else:
                vals = []
            values[n] = vals
        out[name] = {"vectors": vectors, "values": values}
    return out


def read_float_values(data, table, slot):
    at = field(data, table, slot)
    if not at:
        return []
    start = indirect(data, at)
    count = u32(data, start)
    return [f32(data, start + 4 + i * 4) for i in range(count)]


def material_report(path):
    data = path.read_bytes()
    root = table_root(data)
    return parse_materials(data, root)


def bone_world_matrices(bones, tracks, frame):
    local = []
    for bone in bones:
        tr = tracks.get(bone["name"], {})
        trans = track_at(tr.get("translation", []), frame)
        scale = track_at(tr.get("scale", []), frame)
        trans = bone["translation"] if trans is None else trans
        scale = bone["scale"] if scale is None else scale
        rot_track = tr.get("rotation", [])
        if rot_track:
            keys = [(float(f), unpack_quat(q)) for f, q in rot_track]
            if frame <= keys[0][0]:
                rot = keys[0][1]
            elif frame >= keys[-1][0]:
                rot = keys[-1][1]
            else:
                rot = keys[0][1]
                for (fa, qa), (fb, qb) in zip(keys, keys[1:]):
                    if fa <= frame <= fb:
                        rot = quat_slerp(qa, qb, 0 if fb == fa else (frame - fa) / (fb - fa))
                        break
            rmat = quat_matrix(rot)
        else:
            rmat = euler_matrix(bone["rotation"])
        m = np.eye(4)
        m[:3, :3] = rmat @ np.diag(scale)
        m[:3, 3] = trans
        local.append(m)
    world = [None] * len(bones)

    def resolve(i, active=()):
        if i < 0 or i >= len(bones):
            return np.eye(4)
        if world[i] is not None:
            return world[i]
        if i in active:
            return local[i]
        parent = bones[i]["parent"]
        world[i] = resolve(parent, active + (i,)) @ local[i] if parent >= 0 else local[i]
        return world[i]

    return np.array([resolve(i) for i in range(len(bones))])


def matrix_for_bones(bones, tracks, frame):
    return bone_world_matrices(bones, tracks, frame)[:, :3, 3]


def font(size):
    for name in ("segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def skeleton_frame(bones, tracks, frame, yaw=-20, size=512):
    pts = matrix_for_bones(bones, tracks, frame)
    by_name = {b["name"]: i for i, b in enumerate(bones)}
    # Animation files can key reference roots such as Origin, but these are
    # coordinate anchors rather than visible skeleton joints.
    selected = {
        by_name[name] for name in tracks if name in by_name and name != "Origin" and not name.startswith("pm0006_00")
    }
    for i in tuple(selected):
        parent = bones[i]["parent"]
        while 0 <= parent < len(bones):
            name = bones[parent]["name"]
            if name in ("Origin", "pm0006_00") or name.startswith("pm0006_00_"):
                break
            selected.add(parent)
            parent = bones[parent]["parent"]
    selected = sorted(selected)
    pts = pts[selected]
    yaw = math.radians(yaw)
    # Same standing bind pose and fixed yaw for each frame; only bone tracks change.
    right = np.array([math.sin(yaw), 0, -math.cos(yaw)])
    up = np.array([0, 1, 0])
    p = np.stack((pts @ right, pts @ up), axis=1)
    ext = np.maximum(p.max(axis=0) - p.min(axis=0), 1e-4)
    scale = size * 0.75 / max(ext)
    center = (p.max(axis=0) + p.min(axis=0)) / 2
    screen = (p - center) * scale + size / 2
    # Pillow's Y axis points down, while the model's world-space Y points up.
    # Keep the skeleton upright in the image instead of mirroring it vertically.
    screen[:, 1] = size / 2 - (p[:, 1] - center[1]) * scale
    im = Image.new("RGB", (size, size), "white")
    d = ImageDraw.Draw(im)
    screen_by_bone = {bone_index: screen_pos for bone_index, screen_pos in zip(selected, screen)}
    for i in selected:
        b = bones[i]
        par = b["parent"]
        if par in screen_by_bone and par != i:
            d.line((*screen_by_bone[par], *screen_by_bone[i]), fill=(135, 151, 164), width=3)
    for x, y in screen:
        r = 4
        d.ellipse((x - r, y - r, x + r, y + r), fill=(230, 111, 53), outline=(45, 71, 89), width=1)
    return im


def scalar_at(track, frame):
    if not track:
        return 0.0
    if frame <= track[0][0]:
        return float(track[0][1])
    if frame >= track[-1][0]:
        return float(track[-1][1])
    for (fa, a), (fb, b) in zip(track, track[1:]):
        if fa <= frame <= fb:
            t = 0.0 if fb == fa else (frame - fa) / (fb - fa)
            return float(a * (1 - t) + b * t)
    return float(track[-1][1])


def sprite_sheet(frames, output, columns=5, cell=300, label_height=30):
    rows = math.ceil(len(frames) / columns)
    sheet = Image.new("RGB", (columns * cell, rows * (cell + label_height)), "white")
    d = ImageDraw.Draw(sheet)
    fnt = font(16)
    for i, im in enumerate(frames):
        x, y = (i % columns) * cell, (i // columns) * (cell + label_height)
        im = im.resize((cell, cell), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y + label_height))
        d.text((x + 8, y + 6), f"frame {i}", fill=(50, 59, 67), font=fnt)
        d.rectangle((x, y + label_height, x + cell - 1, y + label_height + cell - 1), outline=(213, 218, 221), width=1)
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("model", type=Path)
    p.add_argument("wait", type=Path)
    p.add_argument("loop", type=Path)
    p.add_argument("--out", type=Path, required=True)
    args = p.parse_args()
    bones = read_model(args.model)
    waitdata, waitlen, waitfps, waittracks = read_animation(args.wait)
    print(f"wait: {waitlen} frames, {waitfps} fps, {len(waittracks)} bone tracks / {len(bones)} model bones")
    frames = [skeleton_frame(bones, waittracks, i) for i in range(waitlen)]
    sprite_sheet(frames[:10], args.out / "charizard-battle-wait-skeleton-frames-00-09.png")
    frames[0].save(
        args.out / "charizard-battle-wait-skeleton.gif", save_all=True, append_images=frames[1:], duration=33, loop=0
    )
    loopdata, looplen, loopfps, looptracks = read_animation(args.loop)
    materials = material_report(args.loop)
    print(f"loop01: {looplen} frames, {loopfps} fps, {len(materials)} material groups")
    specs = {
        "FireCore": [
            ("Blend0: FireStenA1_msk", Path("FireStenA1_msk"), "Blend0UVTranslateU", "Blend0UVTranslateV"),
            ("Blend1: FireStenA2_msk", Path("FireStenA2_msk"), "Blend1UVTranslateU", "Blend1UVTranslateV"),
        ],
        "FireMask": [
            ("Mask0: FireCoreA1_msk", Path("FireCoreA1_msk"), "Mask0UVTranslateU", "Mask0UVTranslateV"),
            ("Mask1: FireCoreA2_msk", Path("FireCoreA2_msk"), "Mask1UVTranslateU", "Mask1UVTranslateV"),
        ],
    }
    summary = {
        "model": {"file": args.model.name, "bone_count": len(bones)},
        "battle_wait": {
            "file": args.wait.name,
            "frames": waitlen,
            "frames_per_second": waitfps,
            "bone_tracks": {
                name: {channel: len(track) for channel, track in channels.items()}
                for name, channels in waittracks.items()
            },
            "sprite_sheet_frames": list(range(10)),
            "gif_frames": list(range(waitlen)),
            "companion_clips_loaded": [],
        },
        "flame_loop": {
            "file": args.loop.name,
            "frames": looplen,
            "frames_per_second": loopfps,
            "material_groups": {},
        },
    }
    for material, inputs in specs.items():
        vals = materials[material]["values"]
        summary["flame_loop"]["material_groups"][material] = {
            "inputs": [
                {
                    "sampler": label,
                    "texture": texture.name,
                    "uv_translate_u": u_name,
                    "uv_translate_v": v_name,
                    "frames_0_to_9": [
                        [round(scalar_at(vals.get(u_name, []), i), 6), round(scalar_at(vals.get(v_name, []), i), 6)]
                        for i in range(10)
                    ],
                }
                for label, texture, u_name, v_name in inputs
            ]
        }
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "charizard-animation-track-summary.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    print("wrote upright skeleton previews and flame-track summary to", args.out)


if __name__ == "__main__":
    main()
