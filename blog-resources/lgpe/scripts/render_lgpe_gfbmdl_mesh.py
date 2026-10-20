#!/usr/bin/env python3
"""Render GFBMDL geometry as a plain white mesh, without loading materials or textures."""

import argparse
import struct
from pathlib import Path

import matplotlib

matplotlib.use("TkAgg" if "--preview" in __import__("sys").argv else "Agg")
import matplotlib.pyplot as plt
import numpy as np


def u16(data, at):
    return struct.unpack_from("<H", data, at)[0]


def u32(data, at):
    return struct.unpack_from("<I", data, at)[0]


def i32(data, at):
    return struct.unpack_from("<i", data, at)[0]


def table_field(data, table, slot):
    vtable = table - i32(data, table)
    vsize = u16(data, vtable)
    entry = vtable + 4 + slot * 2
    if entry + 2 > vtable + vsize:
        return 0
    offset = u16(data, entry)
    return table + offset if offset else 0


def indirect(data, at):
    return at + u32(data, at) if at else 0


def vector(data, table, slot):
    field = table_field(data, table, slot)
    start = indirect(data, field)
    if not start:
        return []
    count = u32(data, start)
    return [start + 4 + i * 4 for i in range(count)]


def string(data, table, slot):
    field = table_field(data, table, slot)
    if not field:
        return ""
    start = indirect(data, field)
    size = u32(data, start)
    return data[start + 4 : start + 4 + size].decode("utf-8", "replace")


def struct3(data, table, slot, default):
    field = table_field(data, table, slot)
    if not field:
        return np.asarray(default, dtype=np.float64)
    return np.asarray(struct.unpack_from("<fff", data, field), dtype=np.float64)


def bone_matrices(data, root):
    bones = []
    for ref in vector(data, root, 9):
        bone = indirect(data, ref)
        parent_at = table_field(data, bone, 2)
        parent = i32(data, parent_at) if parent_at else -1
        scale = struct3(data, bone, 5, (1, 1, 1))
        rotation = struct3(data, bone, 6, (0, 0, 0))
        translation = struct3(data, bone, 7, (0, 0, 0))

        sx, sy, sz = scale
        x, y, z = rotation
        cx, cy, cz = np.cos((x, y, z))
        ax, ay, az = np.sin((x, y, z))
        rx = np.array([[1, 0, 0], [0, cx, -ax], [0, ax, cx]])
        ry = np.array([[cy, 0, ay], [0, 1, 0], [-ay, 0, cy]])
        rz = np.array([[cz, -az, 0], [az, cz, 0], [0, 0, 1]])
        local = np.eye(4)
        local[:3, :3] = rz @ ry @ rx @ np.diag((sx, sy, sz))
        local[:3, 3] = translation
        bones.append((parent, local))

    world = [None] * len(bones)

    def resolve(index, active=None):
        if index < 0 or index >= len(bones):
            return np.eye(4)
        if world[index] is not None:
            return world[index]
        active = set() if active is None else active
        if index in active:
            return bones[index][1]
        active.add(index)
        parent, local = bones[index]
        world[index] = resolve(parent, active) @ local if parent >= 0 else local
        active.remove(index)
        return world[index]

    return [resolve(i) for i in range(len(bones))]


def attribute_stride(kind, fmt, count):
    if kind == 0 or kind == 1 or kind == 2:
        return count * (4 if fmt == 0 else 2)
    if 3 <= kind <= 6:
        return count * (4 if fmt == 0 else 2)
    if 7 <= kind <= 10:
        return count
    if kind == 11:
        return count * (2 if fmt == 5 else 1)
    if kind == 12:
        return count
    raise ValueError(f"Unsupported GFBMDL attribute type={kind}, format={fmt}")


def decode_vertices(data, mesh):
    attrs = []
    stride = 0
    for ref in vector(data, mesh, 1):
        attr = indirect(data, ref)
        kind_at = table_field(data, attr, 0)
        fmt_at = table_field(data, attr, 1)
        count_at = table_field(data, attr, 2)
        kind = u32(data, kind_at) if kind_at else 0
        fmt = u32(data, fmt_at) if fmt_at else 0
        count = u32(data, count_at) if count_at else 0
        attrs.append((kind, fmt, count, stride))
        stride += attribute_stride(kind, fmt, count)

    pos_attrs = [a for a in attrs if a[0] == 0]
    normal_attrs = [a for a in attrs if a[0] == 1]
    if len(pos_attrs) != 1:
        raise ValueError(f"Expected one Position attribute, found {len(pos_attrs)}")
    if len(normal_attrs) != 1:
        raise ValueError(f"Expected one Normal attribute, found {len(normal_attrs)}")
    _, fmt, count, start = pos_attrs[0]
    _, normal_fmt, normal_count, normal_start = normal_attrs[0]
    data_field = table_field(data, mesh, 2)
    data_vec = indirect(data, data_field)
    data_len = u32(data, data_vec)
    raw = memoryview(data)[data_vec + 4 : data_vec + 4 + data_len]
    if stride <= 0 or len(raw) % stride:
        raise ValueError(f"Vertex byte length {len(raw)} is not divisible by stride {stride}")
    vertices = len(raw) // stride

    def read_attribute(attribute_format, offset, component_count):
        if attribute_format == 0:
            dtype = np.dtype("<f4")
        elif attribute_format == 1:
            dtype = np.dtype("<f2")
        else:
            raise ValueError(f"Attribute uses unsupported buffer format {attribute_format}")
        size = dtype.itemsize
        components = np.frombuffer(raw, dtype=dtype).reshape(vertices, stride // size)
        return components[:, offset // size : offset // size + component_count].astype(np.float64)

    positions = read_attribute(fmt, start, 3)
    normals = read_attribute(normal_fmt, normal_start, min(3, normal_count))
    if normals.shape[1] != 3:
        raise ValueError(f"Normal attribute has {normals.shape[1]} components; expected at least 3")
    normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-10)
    return positions, normals


def load_triangles(path):
    data = path.read_bytes()
    if len(data) < 4 or u32(data, 0) >= len(data):
        raise ValueError("Input does not look like a GFBMDL FlatBuffer")
    root = u32(data, 0)
    transforms = bone_matrices(data, root)
    group_refs = vector(data, root, 7)
    mesh_refs = vector(data, root, 8)
    triangles = []
    triangle_normals = []
    total_vertices = 0
    for index, (group_ref, mesh_ref) in enumerate(zip(group_refs, mesh_refs)):
        group = indirect(data, group_ref)
        mesh = indirect(data, mesh_ref)
        bone_at = table_field(data, group, 0)
        bone_index = u32(data, bone_at) if bone_at else 0
        positions, normals = decode_vertices(data, mesh)
        total_vertices += len(positions)
        if bone_index < len(transforms):
            matrix = transforms[bone_index]
            positions = positions @ matrix[:3, :3].T + matrix[:3, 3]
            normals = normals @ np.linalg.inv(matrix[:3, :3])
            normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-10)

        for poly_ref in vector(data, mesh, 0):
            poly = indirect(data, poly_ref)
            face_field = table_field(data, poly, 1)
            face_vec = indirect(data, face_field)
            if not face_vec:
                continue
            face_count = u32(data, face_vec)
            faces = np.frombuffer(data, dtype="<u2", count=face_count, offset=face_vec + 4)
            if face_count % 3:
                raise ValueError(f"Mesh {index} polygon has {face_count} indices, not a triangle list")
            faces = faces.reshape(-1, 3)
            valid = np.all(faces < len(positions), axis=1)
            faces = faces[valid]
            triangles.append(positions[faces])
            triangle_normals.append(normals[faces])

    if not triangles:
        raise ValueError("No triangles decoded from GFBMDL")
    return np.concatenate(triangles, axis=0), np.concatenate(triangle_normals, axis=0), total_vertices


def rasterize_smooth(
    projected_triangles, depths, triangle_normals, light, image_size=1152, draw_edges=False, depth_tolerance=0.01
):
    background = np.asarray((24, 27, 32), dtype=np.uint8)
    image = np.empty((image_size, image_size, 3), dtype=np.uint8)
    image[:] = background
    z_buffer = np.full((image_size, image_size), -np.inf, dtype=np.float32)
    light = light / np.linalg.norm(light)

    for projected, depth, normals in zip(projected_triangles, depths, triangle_normals):
        px = projected[:, 0]
        py = image_size - 1 - projected[:, 1]
        min_x = max(0, int(np.floor(px.min())))
        max_x = min(image_size - 1, int(np.ceil(px.max())))
        min_y = max(0, int(np.floor(py.min())))
        max_y = min(image_size - 1, int(np.ceil(py.max())))
        if min_x > max_x or min_y > max_y:
            continue

        x0, y0 = px[0], py[0]
        x1, y1 = px[1], py[1]
        x2, y2 = px[2], py[2]
        denominator = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
        if abs(denominator) < 1e-10:
            continue

        grid_y, grid_x = np.mgrid[min_y : max_y + 1, min_x : max_x + 1]
        grid_x = grid_x + 0.5
        grid_y = grid_y + 0.5
        w0 = ((y1 - y2) * (grid_x - x2) + (x2 - x1) * (grid_y - y2)) / denominator
        w1 = ((y2 - y0) * (grid_x - x2) + (x0 - x2) * (grid_y - y2)) / denominator
        w2 = 1.0 - w0 - w1
        inside = (w0 >= -1e-6) & (w1 >= -1e-6) & (w2 >= -1e-6)
        depth_map = w0 * depth[0] + w1 * depth[1] + w2 * depth[2]
        z_slice = z_buffer[min_y : max_y + 1, min_x : max_x + 1]
        visible = inside & (depth_map > z_slice)
        if not np.any(visible):
            continue

        interpolated = w0[..., None] * normals[0] + w1[..., None] * normals[1] + w2[..., None] * normals[2]
        interpolated /= np.maximum(np.linalg.norm(interpolated, axis=2, keepdims=True), 1e-10)
        diffuse = np.abs(interpolated @ light)
        values = np.clip(0.62 + 0.33 * diffuse, 0.0, 1.0)
        color = np.repeat(np.rint(values * 255).astype(np.uint8)[..., None], 3, axis=2)
        image_slice = image[min_y : max_y + 1, min_x : max_x + 1]
        image_slice[visible] = color[visible]
        z_slice[visible] = depth_map[visible]

    if draw_edges:
        edge_color = np.asarray((48, 53, 61), dtype=np.uint8)
        for projected, depth in zip(projected_triangles, depths):
            points = projected.copy()
            points[:, 1] = image_size - 1 - points[:, 1]
            for start, end in ((0, 1), (1, 2), (2, 0)):
                a = points[start]
                b = points[end]
                steps = max(1, int(np.ceil(np.max(np.abs(b - a)) * 1.5)))
                t = np.linspace(0.0, 1.0, steps + 1)
                xs = np.rint(a[0] + (b[0] - a[0]) * t).astype(int)
                ys = np.rint(a[1] + (b[1] - a[1]) * t).astype(int)
                zs = depth[start] + (depth[end] - depth[start]) * t
                in_bounds = (xs >= 0) & (xs < image_size) & (ys >= 0) & (ys < image_size)
                xs, ys, zs = xs[in_bounds], ys[in_bounds], zs[in_bounds]
                visible = zs >= z_buffer[ys, xs] - depth_tolerance
                image[ys[visible], xs[visible]] = edge_color

    return image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("gfbmdl", type=Path, help="standalone GFBMDL file")
    parser.add_argument("--output", type=Path, required=True, help="PNG output path")
    parser.add_argument(
        "--yaw",
        "--azimuth",
        dest="yaw",
        type=float,
        default=65,
        help="camera yaw in degrees around the model's up axis",
    )
    parser.add_argument("--elevation", type=float, default=0, help="camera pitch in degrees; roll stays at zero")
    parser.add_argument(
        "--wireframe", action="store_true", help="draw visible triangle edges over the smooth-shaded mesh"
    )
    parser.add_argument("--preview", action="store_true", help="open a Matplotlib preview window")
    args = parser.parse_args()

    triangles, triangle_normals, vertex_count = load_triangles(args.gfbmdl)
    points = triangles.reshape(-1, 3)
    center = (points.min(axis=0) + points.max(axis=0)) * 0.5
    points = points - center
    triangles = triangles - center
    extent = np.maximum(points.max(axis=0) - points.min(axis=0), 1e-5)
    radius = float(extent.max()) * 0.47

    yaw = np.deg2rad(args.yaw)
    pitch = np.deg2rad(args.elevation)
    camera = np.asarray((np.cos(yaw) * np.cos(pitch), np.sin(pitch), np.sin(yaw) * np.cos(pitch)))
    forward = -camera
    world_up = np.asarray((0.0, 1.0, 0.0))
    right = np.cross(forward, world_up)
    right /= np.linalg.norm(right)
    screen_up = np.cross(right, forward)
    screen_up /= np.linalg.norm(screen_up)
    projected = np.stack((points @ right, points @ screen_up), axis=1)
    projected_triangles = np.stack((triangles @ right, triangles @ screen_up), axis=2)
    projected_extent = np.maximum(projected.max(axis=0) - projected.min(axis=0), 1e-5)
    fit = float(projected_extent.max()) * 0.56
    projected_center = (projected.min(axis=0) + projected.max(axis=0)) * 0.5
    image_size = 1152
    pixel_scale = image_size / (2 * fit)
    projected_pixels = (projected_triangles - (projected_center - fit)) * pixel_scale
    depths = triangles @ camera
    light = np.asarray((-0.45, 0.75, 0.55))
    image = rasterize_smooth(
        projected_pixels, depths, triangle_normals, light, image_size, args.wireframe, float(extent.max()) * 0.01
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    plt.imsave(args.output, image)
    print(
        f"Rendered {len(triangles):,} triangles from {vertex_count:,} vertices at yaw={args.yaw:g}, pitch={args.elevation:g}, roll=0 -> {args.output}"
    )
    if args.preview:
        plt.figure(figsize=(8, 8), facecolor="#181b20")
        plt.imshow(image)
        plt.axis("off")
        plt.show()


if __name__ == "__main__":
    main()
