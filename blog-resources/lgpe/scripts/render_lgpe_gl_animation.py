#!/usr/bin/env python3
"""Render LGPE skeletal and material animation from GFPAK through Python/OpenGL."""

import argparse
import copy
import hashlib
import json
import tempfile
from pathlib import Path

import numpy as np
import render_lgpe_animation_study as anim
import render_lgpe_gfbmdl_mesh as fb
import render_lgpe_gl as gl
import unpack_lgpe_gfpak as pak
from encode_lgpe_gif import encode_gif


def locate_clip(entries, names, clip):
    by_hash = {entry["file_hash"]: entry for entry in entries}
    suffix = "_" + clip.lower() + ".gfbanm"
    matches = [(h, n) for h, n in names.items() if Path(n).name.lower().endswith(suffix)]
    if len(matches) != 1:
        raise ValueError(f"Expected one GFPAK reference ending in {suffix!r}; found {len(matches)}")
    file_hash, name = matches[0]
    if file_hash not in by_hash:
        raise ValueError(f"GFPAK reference has no entry: {name}")
    data = by_hash[file_hash]["data"]
    root = anim.table_root(data)
    raw, frames, fps, bones = anim.read_animation_data(data)
    return {
        "name": Path(name).name,
        "data": raw,
        "frames": frames,
        "fps": fps,
        "bones": bones,
        "materials": anim.parse_materials(raw, root),
    }


def value_at(track, frame, unwrap=False):
    if track is None or len(track) == 0:
        return None
    if isinstance(track, np.ndarray):
        return track
    if isinstance(track[0], tuple) and len(track[0]) == 2 and np.isscalar(track[0][0]):
        keys = [(float(f), np.asarray(v, dtype=float)) for f, v in track]
    else:
        keys = [(float(i), np.asarray(v, dtype=float)) for i, v in enumerate(track)]
    if len(keys) == 1 or frame <= keys[0][0]:
        return keys[0][1]
    if frame >= keys[-1][0]:
        return keys[-1][1]
    for (fa, a), (fb, b) in zip(keys, keys[1:]):
        if fa <= frame <= fb:
            t = 0.0 if fb == fa else (frame - fa) / (fb - fa)
            if unwrap and a.size == 1 and b.size == 1:
                delta = float(b - a)
                if abs(delta) > 0.5:
                    delta -= round(delta)
                    if abs(delta) <= 0.1:
                        b = a + delta
            return a * (1 - t) + b * t
    return keys[-1][1]


def quaternion_at(track, frame):
    if not track:
        return None
    keys = [(float(f), anim.unpack_quat(q)) for f, q in track]
    if len(keys) == 1 or frame <= keys[0][0]:
        return keys[0][1]
    if frame >= keys[-1][0]:
        return keys[-1][1]
    for (fa, a), (fb, b) in zip(keys, keys[1:]):
        if fa <= frame <= fb:
            return anim.quat_slerp(a, b, 0.0 if fb == fa else (frame - fa) / (fb - fa))
    return keys[-1][1]


def pose_world_matrices(model_bones, layers):
    local = []
    for bone in model_bones:
        translation = np.asarray(bone["translation"], dtype=float)
        scale = np.asarray(bone["scale"], dtype=float)
        rotation = anim.euler_matrix(bone["rotation"])
        for clip, frame, pose_bones in layers:
            track = pose_bones.get(bone["name"], {})
            value = value_at(track.get("translation"), frame)
            if value is not None:
                translation = np.asarray(value, dtype=float)
            value = value_at(track.get("scale"), frame)
            if value is not None:
                scale = np.asarray(value, dtype=float)
            value = quaternion_at(track.get("rotation"), frame)
            if value is not None:
                rotation = anim.quat_matrix(value)
        matrix = np.eye(4)
        matrix[:3, :3] = rotation @ np.diag(scale)
        matrix[:3, 3] = translation
        local.append(matrix)
    world = [None] * len(local)

    def resolve(i, active=()):
        if i < 0 or i >= len(local):
            return np.eye(4)
        if world[i] is not None:
            return world[i]
        if i in active:
            return local[i]
        parent = model_bones[i]["parent"]
        world[i] = resolve(parent, active + (i,)) @ local[i] if parent >= 0 else local[i]
        return world[i]

    return np.asarray([resolve(i) for i in range(len(local))])


def animated_materials(base_materials, layers):
    result = {m["name"]: copy.deepcopy(m) for m in base_materials}
    for clip, frame, tracks in layers:
        for name, channels in tracks.items():
            material = result.get(name)
            if material is None:
                continue
            for key, track in channels["values"].items():
                if track:
                    value = value_at(track, frame, unwrap="uvtranslate" in key.lower())
                    material["values"][key] = float(np.asarray(value).reshape(-1)[0])
            for key, track in channels["vectors"].items():
                if track:
                    value = value_at(track, frame)
                    material["colors"][key] = np.asarray(value, dtype=float).reshape(-1).tolist()
    return result


def choose_fit(body_frames, body_fps, loop_frames, loop_fps, output_frames, output_fps):
    body_seconds = output_frames / output_fps
    loop_seconds = (loop_frames - 1) / loop_fps
    cycles = max(1, round(body_seconds / loop_seconds))
    speed = cycles * loop_seconds / body_seconds
    if not 0.90 <= speed <= 1.10:
        raise ValueError(f"No flame-loop fit within ±10%: required speed factor {speed:.6f}")
    return cycles, speed, (loop_fps / output_fps) * speed


def render_animation(
    archive,
    out,
    clip_name="ba10_waitA01",
    shiny=False,
    body_cycles=4,
    frames=None,
    fps=30,
    size=1024,
    ssaa=2,
    yaw=-20,
    env_light=None,
    fit_flame=True,
    mouth=False,
    eye=False,
    frame_dir=None,
    report=None,
    gif_size=384,
    force=False,
    camera_scale=0.75,
):
    archive = Path(archive)
    out = Path(out)
    if out.exists() and not force:
        raise FileExistsError(f"Output exists: {out}; use --force to replace it")
    fit_flame = bool(fit_flame and clip_name == "ba10_waitA01")
    entries, names = pak.read_archive(archive)
    body = locate_clip(entries, names, clip_name)
    body_period = max(body["frames"] - 1, 1)
    if frames is None:
        frames = body_period * (body_cycles if clip_name == "ba10_waitA01" else 1)
    if frames < 1 or fps < 1:
        raise ValueError("Frame count and output rate must be positive")

    companions = {}
    for name in ("loop01", "mouth01", "eye01"):
        try:
            companions[name] = locate_clip(entries, names, name)
        except ValueError:
            if name == "loop01":
                raise
    loop = companions["loop01"]
    fit_cycles = 1
    speed = 1.0
    loop_step = loop["fps"] / fps
    if fit_flame:
        if frames % body_period:
            raise ValueError("Flame fitting requires a whole number of body cycles")
        fit_cycles, speed, loop_step = choose_fit(body["frames"], body["fps"], loop["frames"], loop["fps"], frames, fps)
    elif clip_name == "ba10_waitA01" and body_cycles and frames % body_period == 0:
        pass

    model_name = archive.stem + ("_rare" if shiny else "") + ".gfbmdl"
    model_hash = pak.fnv64a1(model_name)
    model_entry = next((e for e in entries if e["file_hash"] == model_hash), None)
    if model_entry is None:
        raise ValueError(f"{model_name} is missing from the GFPAK")
    model_data = model_entry["data"]
    model_root = fb.u32(model_data, 0)
    model_bones = anim.read_model_data(model_data)
    bind_world = np.asarray(fb.bone_matrices(model_data, model_root), dtype=float)
    inverse_bind = np.linalg.inv(bind_world)

    if env_light:
        travel = np.frombuffer(Path(env_light).read_bytes(), dtype="<f4", count=3, offset=0x28).astype("f4")
        light = -travel
        if not 0.99 < float(np.linalg.norm(light)) < 1.01:
            raise ValueError("EnvDirLight direction is not unit length")
    else:
        light = np.asarray((-0.55, 0.766, 0.6428), dtype="f4")

    enabled_layers = set()
    if eye and "eye01" in companions:
        enabled_layers.add("eye01")
    if mouth and "mouth01" in companions:
        enabled_layers.add("mouth01")
    temporary = None
    if frame_dir:
        work = Path(frame_dir)
        work.mkdir(parents=True, exist_ok=True)
        frame_paths = sorted(work.glob("lgpe_anim_f*.png"))
        if frame_paths and not force:
            raise FileExistsError(f"Frame directory contains existing captures: {work}")
        if force:
            for path in frame_paths:
                path.unlink()
        temporary = None
    else:
        temporary = tempfile.TemporaryDirectory(prefix="lgpe-python-gl-")
        work = Path(temporary.name)
        temporary_dir = temporary
    if camera_scale <= 0:
        raise ValueError("Camera scale must be positive")
    renderer = gl.LGPEGLRenderer(archive, size, ssaa, yaw, shiny, camera_scale=camera_scale)
    try:
        bounds_min = np.full(3, np.inf, dtype="f4")
        bounds_max = np.full(3, -np.inf, dtype="f4")
        for i in range(frames):
            body_frame = (i * body["fps"] / fps) % body_period
            bone_layers = [(body["name"], body_frame, body["bones"])]
            if mouth and "mouth01" in companions:
                c = companions["mouth01"]
                cf = (i * c["fps"] / fps) % max(c["frames"], 1)
                bone_layers.append((c["name"], cf, c["bones"]))
            current_world = pose_world_matrices(model_bones, bone_layers)
            renderer.apply_pose_matrices(current_world @ inverse_bind)
            for polygon in renderer.polygons:
                positions = polygon["attributes"]["vPosition"]
                bounds_min = np.minimum(bounds_min, positions.min(axis=0))
                bounds_max = np.maximum(bounds_max, positions.max(axis=0))
        corners = np.asarray(
            [
                (x, y, z)
                for x in (bounds_min[0], bounds_max[0])
                for y in (bounds_min[1], bounds_max[1])
                for z in (bounds_min[2], bounds_max[2])
            ],
            dtype="f4",
        )
        renderer.setup_camera(yaw, camera_scale, corners)

        def capture_frame(i):
            body_frame = (i * body["fps"] / fps) % body_period
            bone_layers = [(body["name"], body_frame, body["bones"])]
            if mouth and "mouth01" in companions:
                c = companions["mouth01"]
                cf = (i * c["fps"] / fps) % max(c["frames"], 1)
                bone_layers.append((c["name"], cf, c["bones"]))
            current_world = pose_world_matrices(model_bones, bone_layers)
            renderer.apply_pose_matrices(current_world @ inverse_bind)

            material_layers = [(body["name"], body_frame, body["materials"])]
            lf = (i * loop_step) % max(loop["frames"] - 1, 1)
            material_layers.append((loop["name"], lf, loop["materials"]))
            for name in ("eye01", "mouth01"):
                if name in enabled_layers:
                    c = companions[name]
                    cf = (i * c["fps"] / fps) % max(c["frames"], 1)
                    material_layers.append((c["name"], cf, c["materials"]))
            current_materials = animated_materials(renderer.materials, material_layers)
            for polygon in renderer.polygons:
                polygon["material"] = current_materials[polygon["material"]["name"]]
            return renderer.render(True, light)

        first_image = None
        for i in range(frames):
            image = capture_frame(i)
            if i == 0:
                first_image = image.copy()
            path = work / f"lgpe_anim_f{i:04d}.png"
            image.save(path)
        paths = [work / f"lgpe_anim_f{i:04d}.png" for i in range(frames)]
        gif_encoding = encode_gif(paths, out, fps=fps, size=gif_size)
        endpoint_check = None
        if fit_flame and not (eye or mouth):
            endpoint = capture_frame(frames)
            delta = np.abs(np.asarray(first_image, dtype=np.int16) - np.asarray(endpoint, dtype=np.int16))
            endpoint_check = {
                "frame_index": frames,
                "pixel_identical": not bool(np.any(delta)),
                "max_channel_delta": int(delta.max()),
            }
            if not endpoint_check["pixel_identical"]:
                raise RuntimeError(f'Loop endpoint differs from frame 0 by up to {endpoint_check["max_channel_delta"]}')
    finally:
        renderer.close()
    if temporary is not None:
        temporary.cleanup()

    report_data = {
        "archive": archive.name,
        "archive_sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
        "model": model_name,
        "shiny": shiny,
        "clip": body["name"],
        "clip_frames": body["frames"],
        "clip_fps": body["fps"],
        "body_period_frames": body_period,
        "output_frames": frames,
        "output_fps": fps,
        "body_cycles": frames / body_period,
        "loop": loop["name"],
        "loop_frames": loop["frames"],
        "loop_fps": loop["fps"],
        "loop_cycles": fit_cycles,
        "loop_speed_factor": speed,
        "loop_samples_per_output_frame": loop_step,
        "eye_companion": bool(eye and "eye01" in companions),
        "mouth_companion": bool(mouth and "mouth01" in companions),
        "environment_light": (
            "romfs/bin/field/draw_env/default/EnvDirLight0.gfblt" if env_light else "renderer default direction"
        ),
        "light_direction": (light / np.linalg.norm(light)).tolist(),
        "camera_yaw": yaw,
        "render_size": [size * ssaa, size * ssaa],
        "gif_size": [gif_size, gif_size],
        "camera_scale": camera_scale,
        "renderer": "Python + ModernGL; existing GLSL; Pillow GIF encoding",
        "gif_encoding": gif_encoding,
        "gif_sha256": hashlib.sha256(out.read_bytes()).hexdigest(),
        "loop_endpoint_check": endpoint_check,
        "limitations": [
            "LGPE model/group visibility tracks are not applied by this capture path.",
            "Eye and mouth companion tracks are opt-in; the body clip and loop01 run by default.",
        ],
    }
    if report:
        report = Path(report)
        report.parent.mkdir(parents=True, exist_ok=True)
        report.write_text(json.dumps(report_data, indent=2) + "\n", encoding="utf-8")
    print(f"Rendered {frames} frames: {out} (body {frames/body_period:g} cycles; loop speed {speed:.6f}x)")
    return report_data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("--clip", default="ba10_waitA01")
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--frames", type=int)
    parser.add_argument("--body-cycles", type=int, default=4)
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--size", type=int, default=1024)
    parser.add_argument("--ssaa", type=int, default=2)
    parser.add_argument("--gif-size", type=int, default=384)
    parser.add_argument("--yaw", type=float, default=-20)
    parser.add_argument("--camera-scale", type=float, default=0.75)
    parser.add_argument("--env-light", type=Path)
    parser.add_argument("--shiny", action="store_true")
    parser.add_argument("--no-fit-flame", action="store_true")
    parser.add_argument("--mouth", action="store_true")
    parser.add_argument("--eye", action="store_true")
    parser.add_argument("--frame-dir", type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    if args.frames is None and args.body_cycles < 1:
        parser.error("--body-cycles must be positive")
    render_animation(
        args.archive,
        args.out,
        args.clip,
        args.shiny,
        args.body_cycles,
        args.frames,
        args.fps,
        args.size,
        args.ssaa,
        args.yaw,
        args.env_light,
        not args.no_fit_flame,
        args.mouth,
        args.eye,
        args.frame_dir,
        args.report,
        args.gif_size,
        args.force,
        args.camera_scale,
    )


if __name__ == "__main__":
    main()
