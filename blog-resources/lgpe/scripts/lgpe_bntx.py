"""Read LGPE BNTX mip zero without Toolbox or exported texture sidecars.

Container layout: https://github.com/Tyulis/3DSkit/blob/master/doc/BNTX.md
Block-linear addressing follows Tegra X1's 64-byte by 8-row GOB layout.
BC decoding uses texture2ddecoder; its BGRA output is converted to RGBA.
"""

import struct

import numpy as np
import texture2ddecoder


def number(data, offset, kind="I"):
    return struct.unpack_from("<" + kind, data, offset)[0]


def untile(data, width, height, bytes_per_block, block_height, tiled):
    y, x = np.indices((height, width * bytes_per_block), dtype=np.int64)
    if tiled:
        width_gobs = (width * bytes_per_block + 63) // 64
        address = (
            (y // (8 * block_height)) * 512 * block_height * width_gobs
            + (x // 64) * 512 * block_height
            + ((y % (8 * block_height)) // 8) * 512
            + ((x % 64) // 32) * 256
            + ((y % 8) // 2) * 64
            + ((x % 32) // 16) * 32
            + (y % 2) * 16
            + x % 16
        )
    else:
        pitch = (width * bytes_per_block + 31) // 32 * 32
        address = y * pitch + x
    source = np.frombuffer(data, dtype=np.uint8)
    if address.max() >= len(source):
        raise ValueError("BNTX image data is shorter than its tiled mip layout")
    return source[address].tobytes()


def decode_bntx(data):
    if data[:8] != b"BNTX\0\0\0\0" or data[0xC:0xE] != b"\xff\xfe":
        raise ValueError("Expected a little-endian BNTX container")
    count, table = number(data, 0x24), number(data, 0x28, "Q")
    result = {}
    for i in range(count):
        brti = number(data, table + 8 * i, "Q")
        if data[brti : brti + 4] != b"BRTI":
            raise ValueError("BNTX texture table does not point to BRTI")
        fmt = number(data, brti + 0x1C)
        width, height = struct.unpack_from("<II", data, brti + 0x24)
        depth, layers = struct.unpack_from("<II", data, brti + 0x2C)
        if depth != 1 or layers != 1:
            raise ValueError("The blog reader supports non-array 2D BNTX textures")
        name_at = number(data, brti + 0x60, "Q")
        name_len = number(data, name_at, "H")
        name = data[name_at + 2 : name_at + 2 + name_len].decode("utf-8")
        levels = number(data, brti + 0x70, "Q")
        start = number(data, levels, "Q")
        image_size = number(data, brti + 0x50)
        encoding, color_type = fmt >> 8, fmt & 255
        if encoding == 0x0B:
            block, bpp = 1, 4
        elif encoding in (0x1A, 0x1D):
            block, bpp = 4, 8
        elif encoding in (0x1B, 0x1C, 0x1E, 0x20):
            block, bpp = 4, 16
        else:
            raise ValueError(f"Unsupported BNTX format {fmt:#x} in {name}")
        linear = untile(
            data[start : start + image_size],
            (width + block - 1) // block,
            (height + block - 1) // block,
            bpp,
            1 << (number(data, brti + 0x34) & 7),
            number(data, brti + 0x12, "H") == 0,
        )
        if block == 1:
            pixels = np.frombuffer(linear, dtype=np.uint8).reshape(height, width, 4).copy()
        else:
            decoder = {
                0x1A: "decode_bc1",
                0x1B: "decode_bc2",
                0x1C: "decode_bc3",
                0x1D: "decode_bc4",
                0x1E: "decode_bc5",
                0x20: "decode_bc7",
            }[encoding]
            pixels = (
                np.frombuffer(getattr(texture2ddecoder, decoder)(linear, width, height), dtype=np.uint8)
                .reshape(height, width, 4)[:, :, [2, 1, 0, 3]]
                .copy()
            )
        # BNTX component selectors: 0/1 are constants; 2..5 are RGBA.
        channels = data[brti + 0x58 : brti + 0x5C]
        if channels != bytes((2, 3, 4, 5)):
            source = pixels.copy()
            for channel, selector in enumerate(channels):
                pixels[:, :, channel] = 0 if selector == 0 else 255 if selector == 1 else source[:, :, selector - 2]
        result[name] = {"pixels": pixels, "srgb": color_type == 6, "format": fmt}
    return result
