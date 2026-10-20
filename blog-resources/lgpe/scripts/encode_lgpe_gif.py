#!/usr/bin/env python3
"""Encode transparent PNG captures as GIF using Pillow, with local palettes."""

import argparse
import re
from pathlib import Path

import numpy as np
from PIL import Image


def encode_gif(paths, output, fps=30, size=384, alpha_threshold=64):
    paths = list(paths)
    if not paths:
        raise ValueError("No PNG frames supplied")
    if not 0 < fps <= 100:
        raise ValueError("GIF frame rate must be in (0, 100]")
    frames = []
    for path in paths:
        with Image.open(path) as source:
            rgba = source.convert("RGBA")
            if size and rgba.size != (size, size):
                rgba = rgba.convert("RGBa").resize((size, size), Image.Resampling.LANCZOS).convert("RGBA")
            rgb = rgba.convert("RGB")
            indexed = rgb.quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
            pixels = np.asarray(indexed, dtype="u1").astype("u2") + 1
            pixels[np.asarray(rgba.getchannel("A")) < alpha_threshold] = 0
            frame = Image.fromarray(pixels.astype("u1"), "P")
            # Reserve zero for transparency; retain a full local palette per frame.
            palette = [0, 0, 0] + indexed.getpalette()[: 255 * 3]
            frame.putpalette(palette + [0] * (768 - len(palette)))
            frame.info["transparency"] = 0
            frames.append(frame)
    canvas = frames[0].size
    if any(f.size != canvas for f in frames):
        raise ValueError("GIF frame canvases differ")
    durations = [10 * (round((i + 1) * 100 / fps) - round(i * 100 / fps)) for i in range(len(frames))]
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        output,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        transparency=0,
        background=0,
        disposal=2,
        optimize=False,
        include_color_table=True,
    )
    return {
        "frames_supplied": len(frames),
        "duration_ms": sum(durations),
        "fps": fps,
        "size": list(canvas),
        "bytes": output.stat().st_size,
        "palette": "255 colors per frame plus reserved transparency",
        "encoder": "Pillow",
        "alpha_threshold": alpha_threshold,
    }


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("frames", type=Path)
    p.add_argument("--pattern", default="*.png")
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--fps", type=float, default=30)
    p.add_argument("--size", type=int, default=384)
    p.add_argument("--alpha-threshold", type=int, default=64)
    args = p.parse_args()
    if args.out.exists():
        p.error("Output already exists; choose a new path")

    def order(path):
        return [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", path.name)]

    paths = sorted(args.frames.glob(args.pattern), key=order)
    print(encode_gif(paths, args.out, args.fps, args.size, args.alpha_threshold))


if __name__ == "__main__":
    main()
