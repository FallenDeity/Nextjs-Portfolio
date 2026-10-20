#!/usr/bin/env python3
"""Compare LGPE ramp and scene-light inputs with Python OpenGL, no Toolbox."""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from make_lgpe_shader_comparison_grids import capture, make_grid


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--archive", type=Path, required=True)
    p.add_argument("--light-record", type=Path, required=True)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--report", type=Path)
    p.add_argument("--size", type=int, default=1024)
    p.add_argument("--ssaa", type=int, default=2)
    p.add_argument("--yaw", type=float, default=-20)
    args = p.parse_args()
    travel = np.frombuffer(args.light_record.read_bytes(), dtype="<f4", count=3, offset=0x28).copy()
    if not 0.99 < np.linalg.norm(travel) < 1.01:
        p.error("Light record does not contain a unit direction")
    light = -travel / np.linalg.norm(travel)
    base = dict(archive=args.archive, size=args.size, ssaa=args.ssaa, yaw=args.yaw, fire=True)
    fixed = capture(**base, fixed_ndotl=0.5, key_light=light)
    official = capture(**base, key_light=light)
    previous = capture(**base)
    make_grid(
        fixed,
        official,
        args.output,
        "N·L held at 0.5",
        "N·L from EnvDirLight0.gfblt",
        "All default and fire passes enabled",
        "Same passes and camera; only ramp N·L source changes",
    )
    stage = args.output.with_name("charizard-lighting-stage-comparison.png")
    make_grid(
        previous,
        official,
        stage,
        "Renderer light direction",
        "EnvDirLight0.gfblt direction",
        "All default and fire passes enabled",
        "Same passes and camera; scene direction supplied",
    )
    report = {
        "backend": "Python + ModernGL",
        "external_renderer_process": False,
        "light_record": str(args.light_record),
        "light_record_sha256": hashlib.sha256(args.light_record.read_bytes()).hexdigest(),
        "travel_direction": travel.tolist(),
        "direction_toward_light": light.tolist(),
        "ramp_comparison": "Only ramp N dot L source changes; specular uses the same scene direction",
        "stage_comparison": "Renderer key direction versus scene direction, including specular",
        "ambient_scalar": 1,
        "output": str(args.output),
        "stage_output": str(stage),
    }
    path = args.report or args.output.with_suffix(".json")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote Python OpenGL lighting comparisons to {args.output.parent}")


if __name__ == "__main__":
    main()
