#!/usr/bin/env python3
"""Render LGPE GFBMDL models with the existing GLSL, entirely from Python.

Loads GFPAK and BNTX directly; no C# process or pre-exported PNGs are used.
Supports the blog's PokeDefaultShader and decoded FireMask/FireCore paths.
Static and animated capture entry points share this renderer.
"""

import argparse
import ctypes
import ctypes.util
import hashlib
import json
import math
import re
from pathlib import Path

import moderngl
import numpy as np
import render_lgpe_gfbmdl_mesh as fb
import trace_lgpe_gfbmdl_materials as mats
import unpack_lgpe_gfpak as pak
from lgpe_bntx import decode_bntx
from PIL import Image


def normalized(v):
    v = np.asarray(v, dtype=np.float32)
    return v / max(float(np.linalg.norm(v)), 1e-12)


def matrix_bytes(m):
    return np.asarray(m, dtype="<f4").T.copy().tobytes()


def raw_gl_function(name, signature):
    if hasattr(ctypes, "WinDLL"):
        gl = ctypes.WinDLL("opengl32")
        gl.wglGetProcAddress.argtypes = [ctypes.c_char_p]
        gl.wglGetProcAddress.restype = ctypes.c_void_p
        address = gl.wglGetProcAddress(name.encode())
        if not address or address in (1, 2, 3, ctypes.c_void_p(-1).value):
            raise RuntimeError(f"OpenGL entry point unavailable: {name}")
        return ctypes.WINFUNCTYPE(None, *signature)(address)
    gl = ctypes.CDLL(ctypes.util.find_library("GL") or "libGL.so.1")
    function = getattr(gl, name)
    function.argtypes, function.restype = signature, None
    return function


def mesh_attributes(data, mesh):
    attributes, stride = [], 0
    for ref in fb.vector(data, mesh, 1):
        attr = fb.indirect(data, ref)
        values = [fb.u32(data, at) if (at := fb.table_field(data, attr, i)) else 0 for i in range(3)]
        kind, fmt, count = values
        attributes.append((kind, fmt, count, stride))
        stride += fb.attribute_stride(kind, fmt, count)
    vector = fb.indirect(data, fb.table_field(data, mesh, 2))
    length = fb.u32(data, vector)
    raw = memoryview(data)[vector + 4 : vector + 4 + length]
    if not stride or length % stride:
        raise ValueError("GFBMDL vertex buffer has an invalid stride")
    count = length // stride
    decoded = {}
    formats = {0: "<f4", 1: "<f2", 2: "<i2", 3: "u1", 8: "u1"}
    for kind, fmt, components, offset in attributes:
        if fmt not in formats:
            raise ValueError(f"Unsupported vertex format {fmt} for attribute {kind}")
        a = np.ndarray(
            (count, components),
            dtype=formats[fmt],
            buffer=raw,
            offset=offset,
            strides=(stride, np.dtype(formats[fmt]).itemsize),
        ).astype("f4")
        if fmt == 8 or kind in (7, 8):
            a /= 255
        decoded[kind] = a
    return decoded


def load_archive(path, shiny=False):
    entries, _ = pak.read_archive(path)
    model_name = path.stem + ("_rare" if shiny else "") + ".gfbmdl"
    model = next((e for e in entries if e["file_hash"] == pak.fnv64a1(model_name)), None)
    if model is None:
        raise ValueError(f"{model_name} not found by filename hash in archive")
    data = model["data"]
    root = fb.u32(data, 0)
    texture_names = mats.vector_strings(data, root, 2)
    materials = [
        mats.material_report(data, mats.indirect(data, r), texture_names, i)
        for i, r in enumerate(mats.vector_items(data, root, 6))
    ]
    supported = {"PokeDefaultShader", "PokeFireCoreShader1", "PokeFireMaskShader1"}
    unknown = {m["shader_group"] for m in materials} - supported
    if unknown:
        raise ValueError(f"This blog renderer has no path for {sorted(unknown)}")
    textures = {}
    for entry in entries:
        if entry["extension"] == ".bntx":
            textures.update(decode_bntx(entry["data"]))
    transforms = fb.bone_matrices(data, root)
    bone_refs = fb.vector(data, root, 9)
    skinning_indices = []
    for i, ref in enumerate(bone_refs):
        bone = fb.indirect(data, ref)
        if not fb.table_field(data, bone, 10):
            skinning_indices.append(i)
    polygons = []
    for gr, mr in zip(fb.vector(data, root, 7), fb.vector(data, root, 8)):
        group, mesh = fb.indirect(data, gr), fb.indirect(data, mr)
        decoded = mesh_attributes(data, mesh)
        raw_bone_ids = decoded.get(11)
        raw_weights = decoded.get(12)
        if raw_bone_ids is not None and raw_weights is not None:
            raw_bone_ids = raw_bone_ids.astype(np.int64)
            if raw_bone_ids.size and raw_bone_ids.max() >= len(skinning_indices):
                raise ValueError("GFBMDL vertex references a missing skinning bone")
            skin_bone_ids = np.asarray(skinning_indices, dtype=np.int32)[raw_bone_ids]
            skin_weights = raw_weights.astype("f4")
        else:
            skin_bone_ids = None
            skin_weights = None
        bone = fb.u32(data, at) if (at := fb.table_field(data, group, 0)) else 0
        transform = transforms[bone] if 0 < bone < len(transforms) else np.eye(4)
        positions = decoded[0][:, :3] @ transform[:3, :3].T + transform[:3, 3]
        normals = decoded[1][:, :3] @ transform[:3, :3].T
        normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-12)
        count = len(positions)
        attrs = {
            "vPosition": positions,
            "vNormal": normals,
            "vTangent": decoded.get(2, np.zeros((count, 4)))[:, :3],
            "vBinormal": np.zeros((count, 3)),
            "vUV0": decoded.get(3, np.zeros((count, 2))).copy(),
            "vUV1": decoded.get(4, np.zeros((count, 2))).copy(),
            "vUV2": decoded.get(5, np.zeros((count, 2))).copy(),
            "vColor": decoded.get(7, np.ones((count, 4))),
            "vBone": np.full((count, 4), -1, dtype="f4"),
            "vWeight": np.tile((1, 0, 0, 0), (count, 1)).astype("f4"),
        }
        # Match GFLXModel.FlipUvsVertical for the body path. The decoded fire
        # stages receive the source UVs, as the C# fire upload flips them back.
        for name in ("vUV0", "vUV1", "vUV2"):
            attrs[name][:, 1] = 1 - attrs[name][:, 1]
        fire = np.zeros((count, 5, 4), dtype="<f4")
        fire[:, 0, :3] = positions
        fire[:, 0, 3] = 1
        fire[:, 1, :3] = normals
        if decoded[1].shape[1] > 3:
            fire[:, 1, 3] = decoded[1][:, 3]
        fire[:, 2, :2] = decoded.get(3, np.zeros((count, 2)))[:, :2]
        # Static bind pose uses identity bones. The native shaders read bone
        # indices with floatBitsToInt, so zero is packed as integer bit patterns.
        fire[:, 3, :] = np.zeros((count, 4), dtype="<i4").view("<f4")
        fire[:, 4, 0] = 1
        for pr in fb.vector(data, mesh, 0):
            poly = fb.indirect(data, pr)
            material_index = fb.u32(data, at) if (at := fb.table_field(data, poly, 0)) else 0
            vec = fb.indirect(data, fb.table_field(data, poly, 1))
            n = fb.u32(data, vec)
            indices = np.frombuffer(data, dtype="<u2", count=n, offset=vec + 4).copy()
            if n % 3 or (n and indices.max() >= count):
                raise ValueError("Invalid GFBMDL triangle indices")
            polygons.append(
                {
                    "attributes": attrs,
                    "fire": fire,
                    "indices": indices,
                    "material": materials[material_index],
                    "skin_bone_ids": skin_bone_ids,
                    "skin_weights": skin_weights,
                    "bind_positions": positions.copy(),
                    "bind_normals": normals.copy(),
                }
            )
    return polygons, textures, materials


class LGPEGLRenderer:
    def __init__(
        self,
        archive,
        size=1024,
        ssaa=2,
        yaw=-20,
        shiny=False,
        shader_dir=None,
        fixed_ndotl=None,
        weighted_only=False,
        camera_scale=1.0,
    ):
        self.archive = Path(archive)
        self.size = size
        self.render_size = size * ssaa
        self.shiny = shiny
        self.fixed_ndotl = fixed_ndotl
        self.weighted_only = weighted_only
        self.ctx = moderngl.create_standalone_context(require=450)
        self.resources = []
        self.shaders = Path(shader_dir) if shader_dir else Path(__file__).with_name("lgpe_glsl")
        self.programs = {}
        for key, vert, frag in [
            ("body", "GFBModel.vert", "GFBModel.frag"),
            ("mask", "FireMask.real.vert", "FireMask.real.frag"),
            ("core", "FireCore.real.vert", "FireCore.real.frag"),
        ]:
            fragment = (self.shaders / frag).read_text(encoding="utf-8-sig")
            if key == "body" and fixed_ndotl is not None:
                old = "float ndl = dot(N, L) + ambNdotLBias;"
                if fragment.count(old) != 1:
                    raise ValueError("Fixed-ramp capture shader anchor changed")
                fragment = fragment.replace(old, f"float ndl = {float(fixed_ndotl):.9f} + ambNdotLBias;")
            self.programs[key] = self.keep(
                self.ctx.program(
                    vertex_shader=(self.shaders / vert).read_text(encoding="utf-8-sig"), fragment_shader=fragment
                )
            )
        self.polygons, self.texture_data, self.materials = load_archive(self.archive, shiny)
        self.sampler_parameter = raw_gl_function("glSamplerParameteri", [ctypes.c_uint, ctypes.c_uint, ctypes.c_int])
        self.texture_cache = {}
        self.sampler_cache = {}
        n = self.render_size
        self.color = self.keep(self.ctx.texture((n, n), 4))
        self.depth = self.keep(self.ctx.depth_renderbuffer((n, n)))
        self.target = self.keep(self.ctx.framebuffer([self.color], self.depth))
        self.mask_tex = self.keep(self.ctx.texture((n, n), 4, dtype="f4"))
        self.mask_depth = self.keep(self.ctx.depth_renderbuffer((n, n)))
        self.mask_target = self.keep(self.ctx.framebuffer([self.mask_tex], self.mask_depth))
        self.mask_sampler = self.keep(
            self.ctx.sampler(
                texture=self.mask_tex, filter=(moderngl.NEAREST, moderngl.NEAREST), repeat_x=False, repeat_y=False
            )
        )
        self.ssbo = {i: self.keep(self.ctx.buffer(reserve=65536)) for i in (0, 1, 10, 11, 12, 13)}
        for poly in self.polygons:
            key = self.path(poly["material"])
            p = self.programs[key]
            index = self.keep(self.ctx.buffer(poly["indices"].tobytes()))
            if key == "body":
                content = []
                poly["body_buffers"] = {}
                for name, a in poly["attributes"].items():
                    if name in p:
                        b = self.keep(self.ctx.buffer(np.asarray(a, dtype="<f4").tobytes()))
                        poly["body_buffers"][name] = b
                        content.append((b, f"{a.shape[1]}f", name))
            else:
                vbo = self.keep(self.ctx.buffer(poly["fire"].tobytes()))
                poly["fire_vbo"] = vbo
                names = ["in_attr0", "in_attr1", "in_attr3", "in_attr11", "in_attr12"]
                fmt = " ".join("4f" if name in p else "16x" for name in names)
                content = [(vbo, fmt, *[name for name in names if name in p])]
            poly["vao"] = self.keep(self.ctx.vertex_array(p, content, index, index_element_size=2))
        self.setup_camera(yaw, camera_scale)

    def keep(self, resource):
        self.resources.append(resource)
        return resource

    @staticmethod
    def path(mat):
        return {"PokeDefaultShader": "body", "PokeFireMaskShader1": "mask", "PokeFireCoreShader1": "core"}[
            mat["shader_group"]
        ]

    def setup_camera(self, yaw, camera_scale=1.0, points=None):
        if points is None:
            points = np.concatenate(
                [p["attributes"]["vPosition"] for p in self.polygons if self.path(p["material"]) == "body"]
            )
        else:
            points = np.asarray(points, dtype="f4").reshape(-1, 3)
        lo, hi = points.min(0), points.max(0)
        center = (lo + hi) / 2
        radius = np.linalg.norm(hi - lo) / 2
        # Match front three-quarter framing; model units are kept unchanged.
        angle = math.radians(-yaw)
        direction = np.array((math.sin(angle), 0, math.cos(angle)))
        right = normalized(np.cross(-direction, (0, 1, 0)))
        relative = points - center
        extent = np.maximum(np.abs(relative @ right), np.abs(relative[:, 1]))
        distance = float(np.max(relative @ direction + extent / (math.tan(math.radians(30) / 2) * 0.80)))
        distance *= float(camera_scale)
        self.eye = center + direction * distance
        forward = normalized(center - self.eye)
        right = normalized(np.cross(forward, (0, 1, 0)))
        up = np.cross(right, forward)
        view = np.eye(4)
        view[:3, :3] = np.array((right, up, -forward))
        view[:3, 3] = -view[:3, :3] @ self.eye
        f = 1 / math.tan(math.radians(30) / 2)
        near = max(radius * 0.01, 0.01)
        far = distance + radius * 10
        projection = np.zeros((4, 4))
        projection[0, 0] = projection[1, 1] = f
        projection[2, 2] = (far + near) / (near - far)
        projection[2, 3] = 2 * far * near / (near - far)
        projection[3, 2] = -1
        self.mvp = projection @ view
        self.view_direction = normalized(self.eye - center)
        self.fill = normalized(view[:3, :3].T @ normalized((0.60, 0.15, 0.60)))

    def uniform(self, p, name, value):
        if name not in p:
            return
        member = p[name]
        if isinstance(value, np.ndarray) and value.shape == (4, 4):
            member.write(matrix_bytes(value))
        elif isinstance(value, (tuple, list, np.ndarray)):
            member.value = tuple(float(x) for x in value)
        else:
            member.value = int(value) if member.gl_type in (0x1404, 0x8B56, 0x8B5E) else float(value)

    def buffer(self, binding, data):
        array = np.asarray(data, dtype="<f4")
        b = self.ssbo[binding]
        b.write(array.tobytes())
        b.bind_to_storage_buffer(binding)

    def apply_pose_matrices(self, palette):
        palette = np.asarray(palette, dtype="f4")
        for poly in self.polygons:
            ids = poly["skin_bone_ids"]
            weights = poly["skin_weights"]
            if ids is None or weights is None:
                positions = poly["bind_positions"]
                normals = poly["bind_normals"]
            else:
                positions = np.zeros_like(poly["bind_positions"], dtype="f4")
                normals = np.zeros_like(poly["bind_normals"], dtype="f4")
                for lane in range(4):
                    w = weights[:, lane]
                    active = w > 0
                    if not np.any(active):
                        continue
                    matrices = palette[ids[active, lane]]
                    p = poly["bind_positions"][active]
                    n = poly["bind_normals"][active]
                    positions[active] += (np.einsum("nij,nj->ni", matrices[:, :3, :3], p) + matrices[:, :3, 3]) * w[
                        active, None
                    ]
                    normals[active] += np.einsum("nij,nj->ni", matrices[:, :3, :3], n) * w[active, None]
                normals /= np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-12)
            poly["attributes"]["vPosition"] = positions
            poly["attributes"]["vNormal"] = normals
            for name in ("vPosition", "vNormal"):
                buffer = poly.get("body_buffers", {}).get(name)
                if buffer is not None:
                    buffer.write(np.asarray(poly["attributes"][name], dtype="<f4").tobytes())
            if "fire_vbo" in poly:
                poly["fire"][:, 0, :3] = positions
                poly["fire"][:, 1, :3] = normals
                poly["fire_vbo"].write(poly["fire"].tobytes())

    def sampler(self, mat, sampler_name):
        binding = next((x for x in mat["textures"] if x["sampler"] == sampler_name), None)
        if binding is None:
            raise ValueError(f'{mat["name"]}: no binding for {sampler_name}')
        name = binding["texture_name"]
        if self.shiny and name and name.endswith(("_col", "_sdw")) and name + "_rare" in self.texture_data:
            name += "_rare"
        if name not in self.texture_data:
            raise ValueError(f"Missing BNTX texture: {name}")
        if name not in self.texture_cache:
            source = self.texture_data[name]
            pixels = source["pixels"]
            height, width = pixels.shape[:2]
            # Match native BNTX upload: raw row order, sRGB hardware decode for color maps.
            tex = self.keep(
                self.ctx.texture(
                    (width, height), 4, pixels.tobytes(), internal_format=0x8C43 if source["srgb"] else 0x8058
                )
            )
            tex.build_mipmaps()
            self.texture_cache[name] = tex
        key = (name, binding["wrap_u"], binding["wrap_v"])
        if key not in self.sampler_cache:
            sampler = self.keep(
                self.ctx.sampler(
                    texture=self.texture_cache[name], filter=(moderngl.LINEAR_MIPMAP_LINEAR, moderngl.LINEAR)
                )
            )
            wraps = {"Repeat": 0x2901, "Clamp": 0x812F, "Mirror": 0x8370}
            # ModernGL exposes repeat/clamp publicly; native mirrored repeat
            # needs the GL sampler handle in the pinned 5.13 release.
            self.sampler_parameter(sampler._glo, 0x2802, wraps[binding["wrap_u"]])
            self.sampler_parameter(sampler._glo, 0x2803, wraps[binding["wrap_v"]])
            self.sampler_cache[key] = sampler
        return self.sampler_cache[key]

    def bind(self, p, mat, sampler_name, uniform_name, unit):
        self.sampler(mat, sampler_name).use(unit)
        self.uniform(p, uniform_name, unit)

    def body_material(self, mat, key_light):
        p = self.programs["body"]
        source = (self.shaders / "GFBModel.frag").read_text(encoding="utf-8-sig")
        for kind, name in re.findall(r"^uniform\s+(int|float|vec3)\s+(\w+)\s*;", source, re.M):
            default = (1, 1, 1) if kind == "vec3" else 0
            if any(token in name for token in ("ScaleU", "ScaleV")) or name in (
                "LightMul",
                "LightAmbient",
                "RimColorVal",
                "RimLimit",
                "SphereMapColorVal",
                "ConstantAlpha",
                "OnGameEmissionVal",
                "OnGameAlpha",
                "Layer1OverLerpValue",
                "SpecularPower",
            ):
                default = 1
            if name.startswith("L1AddColor"):
                default = (0, 0, 0) if kind == "vec3" else 0
            self.uniform(p, name, default)
        for collection in ("values", "switches", "colors"):
            for name, value in mat[collection].items():
                self.uniform(p, name, value)
        for name, value in mat["common"].get("values", {}).items():
            self.uniform(p, name, value)
        for name, value in {
            "LightAmbient": 1,
            "HasValidUV1": 1,
            "IsEyeMesh": 0,
            "RedChannel": 1,
            "GreenChannel": 1,
            "BlueChannel": 1,
            "AlphaChannel": 1,
        }.items():
            self.uniform(p, name, value)
        self.uniform(p, "mtxCam", self.mvp)
        self.uniform(p, "mtxMdl", np.eye(4))
        self.uniform(p, "camPosObj", self.eye)
        self.uniform(p, "viewDirObj", self.view_direction)
        self.uniform(p, "specLightDirection", normalized(key_light))
        self.uniform(p, "difLightDirection", self.fill)
        mapping = [
            ("Col0Tex", "DiffuseMap", "HasDiffuse"),
            ("ColSdw0Tex", "ShadowMap", "HasShadowMap"),
            ("AmbientTex", "AmbientMap", "HasAmbientMap"),
            ("LyCol0Tex", "OverlayMap", "HasOverlayMap"),
            ("LightTblTex", "LightTblMap", "HasLightTbl"),
            ("EmissionMaskTex", "EmissionMaskMap", "HasEmissionMask"),
            ("SphereMapTex", "SphereMapMap", "HasSphereMap"),
            ("EffectTex", "EffectMap", "HasEffectMap"),
            ("NormalMapTex", "NormalMap", "HasNormalMap"),
        ]
        for unit, (sampler, uniform, flag) in enumerate(mapping):
            exists = any(x["sampler"] == sampler for x in mat["textures"])
            if sampler == "LyCol0Tex":
                exists = any(
                    x["sampler"] == sampler and "dummy" not in (x["texture_name"] or "").lower()
                    for x in mat["textures"]
                )
            self.uniform(p, flag, int(exists))
            if exists:
                self.bind(p, mat, sampler, uniform, unit)
        if self.weighted_only:
            for name, value in {
                "SpecularScale": 0,
                "RimStrength": 0,
                "SphereMapEnable": 0,
                "EffectVal": 0,
                "EmissionMaskVal": 0,
                "OnGameColorVal": 0,
                "OnGameEmissionVal": 1,
                "ConstantColorVal": 0,
            }.items():
                self.uniform(p, name, value)

    def material_state(self, mat):
        common = mat["common"]
        switches = common.get("switches", {})
        values = common.get("values", {})
        if switches.get("DepthTest", True):
            self.ctx.enable(moderngl.DEPTH_TEST)
        else:
            self.ctx.disable(moderngl.DEPTH_TEST)
        self.ctx.fbo.depth_mask = bool(switches.get("DepthWrite", True))
        self.ctx.disable(moderngl.CULL_FACE)
        mode = values.get("BlendMode", 0)
        if mode == 0:
            self.ctx.disable(moderngl.BLEND)
        else:
            self.ctx.enable(moderngl.BLEND)
            self.ctx.blend_func = (
                moderngl.SRC_ALPHA,
                moderngl.ONE if mode == 2 else moderngl.ONE_MINUS_SRC_ALPHA,
                moderngl.ONE,
                moderngl.ONE_MINUS_SRC_ALPHA,
            )

    def fire_material(self, mat):
        key = self.path(mat)
        p = self.programs[key]
        v = mat["values"]
        c = mat["colors"]
        get = lambda n, d=0: float(v.get(n, d))
        transform = np.zeros((32, 4), dtype="f4")
        transform[4:8] = np.eye(4).T
        transform[8:12] = self.mvp.T
        self.buffer(0, transform)
        self.buffer(1, np.eye(4, dtype="f4").T)
        if key == "mask":
            a = np.zeros((8, 4), dtype="f4")
            for i in range(2):
                a[i] = [
                    get(f"Mask{i}UVScaleU", 1),
                    get(f"Mask{i}UVTranslateU"),
                    get(f"Mask{i}UVScaleV", 1),
                    get(f"Mask{i}UVTranslateV"),
                ]
            a[2] = [get("MatLinkID") + 1, get("DiscardValuie", 0.5), get("MaskCalcMode"), 0]
            self.buffer(10, a)
            b = np.zeros((4, 4), dtype="f4")
            b[0, 0] = 1
            self.buffer(11, b)
            # Native numbered samplers run in reverse material order.
            self.bind(p, mat, "Mask1Texture", "SPIRV_Cross_Combinedtexture_0sampler_0", 0)
            self.bind(p, mat, "Mask0Texture", "SPIRV_Cross_Combinedtexture_1sampler_1", 1)
        else:
            a = np.zeros((2, 4), dtype="f4")
            a[0, :2] = [1 / 4095, 1 / 40950]
            self.buffer(10, a)
            b = np.zeros((32, 4), dtype="f4")
            b[19, :3] = self.eye
            b[19, 3] = 1
            self.buffer(11, b)
            a = np.zeros((8, 4), dtype="f4")
            a[0] = [float(self.shiny), get("BaseRimVal", 1), get("RimPower", 1), get("RimStrength")]
            a[1] = [
                get("LayerRimVal", 1),
                get("Blend0UVScaleU", 1),
                get("Blend0UVTranslateU"),
                get("Blend0UVScaleV", 1),
            ]
            a[2] = [
                get("Blend0UVTranslateV"),
                get("Blend1UVScaleU", 1),
                get("Blend1UVTranslateU"),
                get("Blend1UVScaleV", 1),
            ]
            a[3] = [
                get("Blend1UVTranslateV"),
                get("OnGameColorVal", 1),
                get("OnGameAlpha", 1),
                get("OnGameEmissionVal", 1),
            ]
            a[4] = [get("MatLinkID") + 1, get("DiscardValuie", 0.5), get("ConstantColor0Val"), 0]
            self.buffer(12, a)
            a = np.zeros((8, 4), dtype="f4")
            for i, name in enumerate(
                ("BaseColor0", "BaseColor1", "LayerColor0", "LayerColor1", "OnGameColor", "ConstantColor0")
            ):
                a[i, :3] = c.get(name, [1, 1, 1])
                a[i, 3] = 1
            self.buffer(13, a)
            self.mask_sampler.use(0)
            self.uniform(p, "SPIRV_Cross_Combinedtexture_0SPIRV_Cross_DummySampler", 0)
            self.uniform(p, "u_useFireMask", 1)
            for unit, name in enumerate(("Blend1Tex", "Blend0Tex", "LerpTex"), 1):
                self.bind(p, mat, name, f"SPIRV_Cross_Combinedtexture_{unit}sampler_{unit}", unit)

    def render(self, fire=True, key_light=(-0.55, 0.766, 0.6428)):
        ctx = self.ctx
        n = self.render_size
        ctx.viewport = (0, 0, n, n)
        ctx.enable_only(moderngl.DEPTH_TEST)
        ctx.depth_func = "<="
        self.mask_target.use()
        self.mask_target.depth_mask = True
        self.mask_target.clear(0, 0, 0, 0, depth=1)
        if fire:
            for poly in self.polygons:
                if self.path(poly["material"]) == "mask":
                    self.material_state(poly["material"])
                    self.fire_material(poly["material"])
                    poly["vao"].render()
        self.target.use()
        self.target.depth_mask = True
        self.target.clear(0, 0, 0, 0, depth=1)
        for poly in self.polygons:
            key = self.path(poly["material"])
            if key == "mask" or key == "core" and not fire:
                continue
            mat = poly["material"]
            self.material_state(mat)
            if key == "body":
                self.body_material(mat, key_light)
            else:
                self.fire_material(mat)
            poly["vao"].render()
        image = Image.frombytes("RGBA", (n, n), self.target.read(components=4, alignment=1)).transpose(
            Image.Transpose.FLIP_TOP_BOTTOM
        )
        if n != self.size:
            image = image.resize((self.size, self.size), Image.Resampling.LANCZOS)
        return image

    def close(self):
        for resource in reversed(self.resources):
            resource.release()
        self.resources.clear()
        self.ctx.release()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("archive", type=Path)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--size", type=int, default=1024)
    p.add_argument("--ssaa", type=int, default=2)
    p.add_argument("--yaw", type=float, default=-20)
    p.add_argument("--shiny", action="store_true")
    p.add_argument("--no-fire", action="store_true")
    p.add_argument("--env-light", type=Path)
    p.add_argument("--fixed-ndotl", type=float)
    p.add_argument("--weighted-only", action="store_true")
    p.add_argument("--report", type=Path)
    args = p.parse_args()
    if args.size < 1 or args.ssaa < 1:
        p.error("size and ssaa must be positive")
    light = (-0.55, 0.766, 0.6428)
    if args.env_light:
        light = -np.frombuffer(args.env_light.read_bytes(), dtype="<f4", count=3, offset=0x28).astype("f4")
        if not 0.99 < np.linalg.norm(light) < 1.01:
            p.error("EnvDirLight direction is not unit length")
    renderer = LGPEGLRenderer(
        args.archive,
        args.size,
        args.ssaa,
        args.yaw,
        args.shiny,
        fixed_ndotl=args.fixed_ndotl,
        weighted_only=args.weighted_only,
    )
    try:
        image = renderer.render(not args.no_fire, light)
        args.out.parent.mkdir(parents=True, exist_ok=True)
        image.save(args.out)
        report = {
            "archive_sha256": hashlib.sha256(args.archive.read_bytes()).hexdigest(),
            "renderer": "Python + ModernGL; no C# process",
            "gpu": renderer.ctx.info["GL_RENDERER"],
            "pose": "static bind pose",
            "size": args.size,
            "ssaa": args.ssaa,
            "yaw": args.yaw,
            "fire": not args.no_fire,
            "shiny": args.shiny,
            "light_direction": normalized(light).tolist(),
            "fixed_ndotl": args.fixed_ndotl,
            "weighted_only": args.weighted_only,
            "shader_hashes": {
                x.name: hashlib.sha256(x.read_bytes()).hexdigest()
                for x in renderer.shaders.glob("*")
                if x.suffix in (".vert", ".frag")
            },
        }
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(
            f"Rendered {len(renderer.polygons)} polygon groups with {len(renderer.texture_data)} BNTX textures to {args.out}"
        )
    finally:
        renderer.close()


if __name__ == "__main__":
    main()
