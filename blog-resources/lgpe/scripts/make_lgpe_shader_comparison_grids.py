#!/usr/bin/env python3
"""Render static shader comparison figures with Python-owned OpenGL."""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from render_lgpe_gl import LGPEGLRenderer


def font(size):
    for name in ("arial.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def shared_bounds(images):
    boxes = [im.getchannel("A").getbbox() for im in images]
    if any(b is None for b in boxes):
        raise ValueError("A comparison panel is empty")
    return (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))


def make_grid(left, right, out, left_title, right_title, left_note, right_note):
    bounds = shared_bounds((left, right))
    canvas = Image.new("RGB", (1160, 550), "white")
    draw = ImageDraw.Draw(canvas)
    for x, image, title, note in [(18, left, left_title, left_note), (590, right, right_title, right_note)]:
        draw.text((x, 12), title, font=font(18), fill=(35, 40, 46))
        image = image.crop(bounds)
        scale = min(552 / image.width, 460 / image.height)
        image = (
            image.convert("RGBa")
            .resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
            .convert("RGBA")
        )
        canvas.paste(image, (x + (552 - image.width) // 2, 44 + (460 - image.height) // 2), image)
        draw.text((x, 520), note, font=font(13), fill=(84, 90, 97))
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)


def capture(
    archive,
    size=1024,
    ssaa=2,
    yaw=-20,
    fire=True,
    shiny=False,
    key_light=(-0.55, 0.766, 0.6428),
    fixed_ndotl=None,
    weighted_only=False,
):
    renderer = LGPEGLRenderer(archive, size, ssaa, yaw, shiny, fixed_ndotl=fixed_ndotl, weighted_only=weighted_only)
    try:
        return renderer.render(fire, key_light)
    finally:
        renderer.close()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--archive", type=Path, required=True)
    p.add_argument("--out-dir", type=Path, required=True)
    p.add_argument("--capture-dir", type=Path)
    p.add_argument("--camyaw", type=float, default=-20)
    p.add_argument("--size", type=int, default=1024)
    p.add_argument("--ssaa", type=int, default=2)
    p.add_argument("--report", type=Path)
    args = p.parse_args()
    args.out_dir.mkdir(parents=True, exist_ok=True)
    captures = args.capture_dir or args.out_dir / "captures"
    captures.mkdir(parents=True, exist_ok=True)
    base = dict(archive=args.archive, size=args.size, ssaa=args.ssaa, yaw=args.camyaw)
    weighted = capture(**base, fire=False, fixed_ndotl=0.5, weighted_only=True)
    default = capture(**base, fire=False)
    fire = capture(**base, fire=True)
    for name, image in [("weighted", weighted), ("default", default), ("fire", fire)]:
        image.save(captures / f"{name}.png")
    make_grid(
        weighted,
        default,
        args.out_dir / "charizard-default-shader-grid.png",
        "Final weighted sum",
        "PokeDefaultShader",
        "Fixed N·L = 0.5; specular and rim disabled",
        "Directional N·L; enabled material shader terms",
    )
    make_grid(
        default,
        fire,
        args.out_dir / "charizard-fire-shader-grid.png",
        "PokeDefaultShader",
        "PokeDefaultShader + fire",
        "Static bind pose; FireMask and FireCore disabled",
        "Same pose, camera, and light; flame passes enabled",
    )
    report = {
        "backend": "Python + ModernGL",
        "external_renderer_process": False,
        "archive": str(args.archive),
        "archive_sha256": hashlib.sha256(args.archive.read_bytes()).hexdigest(),
        "pose": "static bind pose",
        "yaw": args.camyaw,
        "output_size": args.size,
        "ssaa": args.ssaa,
        "weighted_sum": {"ndotl": 0.5, "specular": False, "rim": False},
        "default_shader": {"light_direction": [-0.55, 0.766, 0.6428]},
        "comparisons_use_shared_bounds": True,
    }
    path = args.report or args.out_dir / "shader-comparison-python.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote shader grids using Python OpenGL to {args.out_dir}")


if __name__ == "__main__":
    main()
