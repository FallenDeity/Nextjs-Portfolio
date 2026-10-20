#!/usr/bin/env python3
"""Render cumulative LGPE diffuse shader contributions over Charizard's body materials."""

import argparse
import importlib.util
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def u16(data, at):
    import struct

    return struct.unpack_from("<H", data, at)[0]


def u32(data, at):
    import struct

    return struct.unpack_from("<I", data, at)[0]


def read_png(path):
    with Image.open(path) as image:
        return np.asarray(image.convert("RGBA"))


def srgb_to_linear(rgb):
    rgb = rgb.astype(np.float32) / 255.0
    return np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(rgb):
    rgb = np.clip(rgb, 0.0, 1.0)
    encoded = np.where(rgb <= 0.0031308, rgb * 12.92, 1.055 * np.power(rgb, 1.0 / 2.4) - 0.055)
    return np.rint(np.clip(encoded, 0.0, 1.0) * 255).astype(np.uint8)


def decode_mesh(data, mesh, viewer):
    attrs, stride = [], 0
    for ref in viewer.vector(data, mesh, 1):
        attr = viewer.indirect(data, ref)
        field = viewer.table_field(data, attr, 0)
        kind = viewer.u32(data, field) if field else 0
        field = viewer.table_field(data, attr, 1)
        fmt = viewer.u32(data, field) if field else 0
        field = viewer.table_field(data, attr, 2)
        count = viewer.u32(data, field) if field else 0
        attrs.append((kind, fmt, count, stride))
        stride += viewer.attribute_stride(kind, fmt, count)

    data_field = viewer.table_field(data, mesh, 2)
    data_vec = viewer.indirect(data, data_field)
    byte_len = viewer.u32(data, data_vec)
    raw = memoryview(data)[data_vec + 4 : data_vec + 4 + byte_len]
    if not stride or len(raw) % stride:
        raise ValueError("Vertex buffer length does not match attribute stride")
    vertex_count = len(raw) // stride
    decoded = {}
    for kind, fmt, count, start in attrs:
        if fmt == 0:
            dtype = np.dtype("<f4")
        elif fmt == 1:
            dtype = np.dtype("<f2")
        else:
            continue
        components = np.frombuffer(raw, dtype=dtype).reshape(vertex_count, stride // dtype.itemsize)
        decoded[kind] = components[:, start // dtype.itemsize : start // dtype.itemsize + count].astype(np.float64)
    if 0 not in decoded or 1 not in decoded or 3 not in decoded or decoded[1].shape[1] < 3 or decoded[3].shape[1] < 2:
        raise ValueError("Mesh needs Position, Normal, and UV1 attributes")
    positions = decoded[0][:, :3]
    normals = decoded[1][:, :3]
    normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-10)
    return positions, normals, decoded[3][:, :2]


def load_triangles(path, viewer):
    data = path.read_bytes()
    root = viewer.u32(data, 0)
    names = []
    for ref in viewer.vector(data, root, 5):
        string_at = viewer.indirect(data, ref)
        n = viewer.u32(data, string_at)
        names.append(data[string_at + 4 : string_at + 4 + n].decode("utf-8", "replace"))
    transforms = viewer.bone_matrices(data, root)
    result = []
    for group_ref, mesh_ref in zip(viewer.vector(data, root, 7), viewer.vector(data, root, 8)):
        group = viewer.indirect(data, group_ref)
        mesh = viewer.indirect(data, mesh_ref)
        positions, normals, uvs = decode_mesh(data, mesh, viewer)
        bone_field = viewer.table_field(data, group, 0)
        bone_index = viewer.u32(data, bone_field) if bone_field else 0
        if bone_index < len(transforms):
            matrix = transforms[bone_index]
            positions = positions @ matrix[:3, :3].T + matrix[:3, 3]
            normals = normals @ np.linalg.inv(matrix[:3, :3])
            normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-10)
        for poly_ref in viewer.vector(data, mesh, 0):
            poly = viewer.indirect(data, poly_ref)
            material_field = viewer.table_field(data, poly, 0)
            material_index = viewer.u32(data, material_field) if material_field else 0
            material = names[material_index] if material_index < len(names) else "Unknown"
            if material in {"FireCore", "FireMask"}:
                continue
            face_field = viewer.table_field(data, poly, 1)
            face_vec = viewer.indirect(data, face_field)
            if not face_vec:
                continue
            count = viewer.u32(data, face_vec)
            indices = np.frombuffer(data, dtype="<u2", count=count, offset=face_vec + 4)
            if count % 3:
                raise ValueError("Polygon index count is not divisible by three")
            faces = indices.reshape(-1, 3)
            for face in faces[np.all(faces < len(positions), axis=1)]:
                result.append((material, positions[face], uvs[face], normals[face]))
    if not result:
        raise ValueError("No body triangles decoded")
    return result


def wrap_uv(values, mode):
    # GFBMDL WrapMode: Repeat=0, Clamp=1, Mirror=2.
    if mode == 0:
        return values - np.floor(values)
    if mode == 1:
        return np.clip(values, 0.0, 1.0)
    if mode == 2:
        cell = np.floor(values)
        fraction = values - cell
        return np.where((cell.astype(np.int64) & 1) == 0, fraction, 1.0 - fraction)
    raise ValueError("Unsupported texture wrap mode {}".format(mode))


def sample_map(image, uv, scale_u, scale_v, wrap_u, wrap_v, shift_u=0.0, shift_v=0.0):
    uv = uv.copy()
    uv[:, 0] = wrap_uv((uv[:, 0] - shift_u) * scale_u, wrap_u)
    uv[:, 1] = wrap_uv((uv[:, 1] - shift_v) * scale_v, wrap_v)
    height, width = image.shape[:2]
    x = np.clip(np.floor(uv[:, 0] * width).astype(int), 0, width - 1)
    y = np.clip(np.floor((1.0 - uv[:, 1]) * height).astype(int), 0, height - 1)
    return image[y, x, :3]


def sample_light_table(ramp, ambient, ndotl, light_index):
    ambient = ambient.astype(np.float32) / 255.0
    u = np.clip((ndotl + 2.0 * (ambient[..., 2] - 0.5)) * 0.5 + 0.5, 0.0, 1.0)
    v = 0.96875 - 0.0625 * light_index
    height, width = ramp.shape[:2]
    # Nearest texel for this figure; clamp on both table axes.
    x = np.clip(np.rint(u * (width - 1)).astype(int), 0, width - 1)
    row_from_bottom = int(np.clip(np.floor(v * height), 0, height - 1))
    y = height - 1 - row_from_bottom
    weights = ramp[y, x, :2].astype(np.float32) / 255.0
    deep, shadow = weights[..., 0], weights[..., 1]
    lit = np.clip(1.0 - deep - shadow, 0.0, 1.0)
    red, green = ambient[..., 0], ambient[..., 1]
    shadow = (shadow + green * lit) * (1.0 - red)
    lit = lit * (1.0 - green) * (1.0 - red)
    deep = deep * (1.0 - red) + red
    return lit, shadow, deep


def uv_settings(material):
    values = material.get("values", {})
    samplers = {entry["sampler"]: entry for entry in material.get("textures", [])}
    base = samplers.get("Col0Tex", {})
    return (
        float(values.get("ColorUVScaleU", 1.0)),
        float(values.get("ColorUVScaleV", 1.0)),
        {"Repeat": 0, "Clamp": 1, "Mirror": 2}.get(base.get("wrap_u"), 2),
        {"Repeat": 0, "Clamp": 1, "Mirror": 2}.get(base.get("wrap_v"), 0),
        float(values.get("ColorBaseU", 0.0)) + float(values.get("ColorUVTranslateU", 0.0)),
        float(values.get("ColorBaseV", 0.0)) + float(values.get("ColorUVTranslateV", 0.0)),
    )


def render_stage(triangles, material_data, ndotl, stage, image_size=512, camera_yaw=65.0):
    points = np.concatenate([triangle[1] for triangle in triangles], axis=0)
    center3 = (points.min(axis=0) + points.max(axis=0)) * 0.5
    centered = points - center3
    yaw = np.deg2rad(camera_yaw)
    camera = np.asarray((np.cos(yaw), 0.0, np.sin(yaw)))
    forward = -camera
    right = np.cross(forward, np.asarray((0.0, 1.0, 0.0)))
    right /= np.linalg.norm(right)
    up = np.cross(right, forward)
    up /= np.linalg.norm(up)
    projected = np.stack((centered @ right, centered @ up), axis=1)
    fit = np.max(projected.max(axis=0) - projected.min(axis=0)) * 0.56
    pcenter = (projected.min(axis=0) + projected.max(axis=0)) * 0.5
    scale = image_size / (2 * fit)
    image = np.full((image_size, image_size, 3), (248, 248, 248), dtype=np.uint8)
    zbuf = np.full((image_size, image_size), -np.inf, dtype=np.float32)

    for material_name, vertices, triangle_uv, triangle_normals in triangles:
        material = material_data.get(material_name)
        if material is None:
            continue
        maps = material["maps"]
        values = material.get("values", {})
        colors = material.get("colors", {})
        scale_u, scale_v, wrap_u, wrap_v, shift_u, shift_v = material["uv"]
        vertices = vertices - center3
        xy = np.stack((vertices @ right, vertices @ up), axis=1)
        screen = (xy - (pcenter - fit)) * scale
        sx = screen[:, 0]
        sy = image_size - 1 - screen[:, 1]
        depth = vertices @ camera
        min_x, max_x = max(0, int(np.floor(sx.min()))), min(image_size - 1, int(np.ceil(sx.max())))
        min_y, max_y = max(0, int(np.floor(sy.min()))), min(image_size - 1, int(np.ceil(sy.max())))
        if min_x > max_x or min_y > max_y:
            continue
        x0, y0, x1, y1, x2, y2 = sx[0], sy[0], sx[1], sy[1], sx[2], sy[2]
        denominator = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
        if abs(denominator) < 1e-10:
            continue
        gy, gx = np.mgrid[min_y : max_y + 1, min_x : max_x + 1]
        gx, gy = gx + 0.5, gy + 0.5
        a = ((y1 - y2) * (gx - x2) + (x2 - x1) * (gy - y2)) / denominator
        b = ((y2 - y0) * (gx - x2) + (x0 - x2) * (gy - y2)) / denominator
        c = 1.0 - a - b
        inside = (a >= -1e-6) & (b >= -1e-6) & (c >= -1e-6)
        z = a * depth[0] + b * depth[1] + c * depth[2]
        zslice = zbuf[min_y : max_y + 1, min_x : max_x + 1]
        visible = inside & (z > zslice)
        if not np.any(visible):
            continue
        uv = a[..., None] * triangle_uv[0] + b[..., None] * triangle_uv[1] + c[..., None] * triangle_uv[2]
        if np.ndim(ndotl) == 1:
            normal = (
                a[..., None] * triangle_normals[0]
                + b[..., None] * triangle_normals[1]
                + c[..., None] * triangle_normals[2]
            )
            normal /= np.maximum(np.linalg.norm(normal, axis=2, keepdims=True), 1e-10)
            pixel_ndotl = normal @ np.asarray(ndotl, dtype=np.float32)
        else:
            pixel_ndotl = ndotl
        uv_flat = uv.reshape(-1, 2)
        base_sample = sample_map(maps["base"], uv_flat, scale_u, scale_v, wrap_u, wrap_v, shift_u, shift_v)
        shadow_sample = sample_map(maps["shadow"], uv_flat, scale_u, scale_v, wrap_u, wrap_v, shift_u, shift_v)
        ambient_sample = sample_map(maps["ambient"], uv_flat, scale_u, scale_v, wrap_u, wrap_v, shift_u, shift_v)
        base = srgb_to_linear(base_sample).reshape(a.shape + (3,))
        shadow = srgb_to_linear(shadow_sample).reshape(a.shape + (3,))
        ambient = ambient_sample.reshape(a.shape + (3,))
        lit_weight, shadow_weight, deep_weight = sample_light_table(
            maps["ramp"], ambient, pixel_ndotl, float(values.get("LightTblIndex", 0.0))
        )
        base_tint = np.asarray(colors.get("ConstantColor0", (1, 1, 1)), dtype=np.float32)
        shadow_tint = np.asarray(colors.get("ConstantColorSd0", (1, 1, 1)), dtype=np.float32)
        deep_tint = np.asarray(colors.get("DeepShadowColor", (1, 1, 1)), dtype=np.float32)
        light_mul = float(values.get("LightMul", 1.0))
        lit_term = base * base_tint[None, None, :] * lit_weight[..., None]
        shadow_term = shadow * shadow_tint[None, None, :] * shadow_weight[..., None]
        deep_term = shadow * shadow_tint[None, None, :] * deep_tint[None, None, :] * deep_weight[..., None]
        if stage == 0:
            pixels = base_sample.reshape(a.shape + (3,))
        elif stage == 1:
            pixels = shadow_sample.reshape(a.shape + (3,))
        elif stage == 2:
            pixels = ambient_sample.reshape(a.shape + (3,))
        elif stage == 3:
            linear_rgb = lit_term
            pixels = linear_to_srgb(linear_rgb * light_mul)
        elif stage == 4:
            linear_rgb = lit_term + shadow_term
            pixels = linear_to_srgb(linear_rgb * light_mul)
        else:
            linear_rgb = lit_term + shadow_term + deep_term
            pixels = linear_to_srgb(linear_rgb * light_mul)
        target = image[min_y : max_y + 1, min_x : max_x + 1]
        target[visible] = pixels[visible]
        zslice[visible] = z[visible]
    if image_size != 512:
        image = np.asarray(Image.fromarray(image).resize((512, 512), Image.Resampling.LANCZOS))
    return image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path)
    parser.add_argument("texture_dir", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--viewer-script", type=Path, required=True)
    parser.add_argument("--ndotl", type=float, default=0.5)
    parser.add_argument(
        "--ssaa", type=int, default=2, help="Raster scale before Lanczos downsampling to 512x512 (default: 2)"
    )
    args = parser.parse_args()
    if args.ssaa < 1:
        parser.error("--ssaa must be at least 1")
    viewer = load_module("mesh_viewer", args.viewer_script)
    trace = load_module("material_trace", args.viewer_script.with_name("trace_lgpe_gfbmdl_materials.py"))
    report = trace.parse_model(args.model)
    triangles = load_triangles(args.model, viewer)
    available = {material["name"]: material for material in report["materials"]}
    material_data = {}
    for name in ("BodyA", "BodyB", "Eye"):
        material = available[name]
        samplers = {entry["sampler"]: entry for entry in material["textures"]}
        maps = {}
        for slot in ("Col0Tex", "ColSdw0Tex", "AmbientTex", "LightTblTex"):
            entry = samplers[slot]
            png_path = args.texture_dir / (entry["texture_name"] + ".png")
            if not png_path.is_file():
                raise FileNotFoundError("Missing decoded texture: {}".format(png_path))
            maps[{"Col0Tex": "base", "ColSdw0Tex": "shadow", "AmbientTex": "ambient", "LightTblTex": "ramp"}[slot]] = (
                read_png(png_path)
            )
        material_data[name] = {
            "maps": maps,
            "values": material.get("values", {}),
            "colors": material.get("colors", {}),
            "uv": uv_settings(material),
        }

    labels = [
        "Col0Tex input",
        "ColSdw0Tex input",
        "AmbientTex RGB",
        "Lit contribution",
        "Lit + shadow",
        "Final weighted sum",
    ]
    formulas = [
        "colBase sampled on each material's UVs",
        "colShadow sampled on each material's UVs",
        "R/G masks; B offsets LightTblTex lookup",
        "colBase × wLit' × LightMul",
        "(colBase × wLit' +\ncolShadow × wShadow') × LightMul",
        "(colBase × wLit' +\ncolShadow × wShadow' +\ncolShadow × DeepShadowColor\n× wDeep') × LightMul",
    ]
    fig, axes = plt.subplots(2, 3, figsize=(9.3, 7.0), gridspec_kw={"wspace": 0.025, "hspace": 0.28})
    for ax, stage, label, formula in zip(axes.flat, range(6), labels, formulas):
        ax.imshow(
            render_stage(triangles, material_data, args.ndotl, stage, image_size=512 * args.ssaa),
            interpolation="nearest",
        )
        ax.text(
            0.035,
            0.965,
            label,
            transform=ax.transAxes,
            ha="left",
            va="top",
            fontsize=6.2,
            color="#20252b",
            bbox={"boxstyle": "round,pad=0.35", "facecolor": "white", "edgecolor": "#c8cdd2", "alpha": 0.92},
        )
        ax.set_axis_off()
        ax.text(
            0.5,
            -0.045,
            formula,
            transform=ax.transAxes,
            ha="center",
            va="top",
            fontsize=5.9,
            linespacing=1.2,
            color="#20252b",
            clip_on=False,
        )
    fig.subplots_adjust(left=0.015, right=0.985, bottom=0.14, top=0.99, hspace=0.22, wspace=0.025)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(args.output, dpi=190, facecolor="white", bbox_inches="tight", pad_inches=0)
    plt.close(fig)
    print(
        "Rendered {} body-material triangles with cumulative diffuse contributions -> {}".format(
            len(triangles), args.output
        )
    )


if __name__ == "__main__":
    main()
