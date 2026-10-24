import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { parseImageAssetUrl } from "@sanity/asset-utils";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import sharp from "sharp";

import { client } from "@/sanity/lib/client";

import { imagePlaceholder, type ImagePlaceholderProps, isSanityImageUrl } from "./image";

const maxBytes = 10 * 1024 * 1024;

async function readImage(src: string): Promise<Buffer | undefined> {
	if (src.startsWith("/") && !src.startsWith("//")) {
		const publicDirectory = path.resolve(process.cwd(), "public");
		const filename = path.resolve(publicDirectory, "." + decodeURIComponent(src.split(/[?#]/)[0]));
		const relative = path.relative(publicDirectory, filename);
		if (relative.startsWith("..") || path.isAbsolute(relative)) return;
		if ((await stat(filename)).size > maxBytes) return;
		return readFile(filename);
	}
	if (!/^https?:\/\//i.test(src)) return;
	const response = await fetch(src, { cache: "no-store", signal: AbortSignal.timeout(8000) });
	if (!response.ok || response.headers.get("content-type")?.includes("svg")) {
		await response.body?.cancel();
		return;
	}
	if (Number(response.headers.get("content-length")) > maxBytes) {
		await response.body?.cancel();
		return;
	}
	const reader = response.body?.getReader();
	if (!reader) return;
	const chunks: Uint8Array[] = [];
	let length = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			length += value.byteLength;
			if (length > maxBytes) return;
			chunks.push(value);
		}
		return Buffer.concat(chunks);
	} finally {
		await reader.cancel();
	}
}

const resolvePlaceholder = unstable_cache(
	async (src: string): Promise<{ blurHash?: string | null; lqip?: string | null } | null> => {
		try {
			if (/\.svg(?:[?#]|$)/i.test(src)) return null;
			if (isSanityImageUrl(src)) {
				const { projectId, dataset, assetId, width, height, extension } = parseImageAssetUrl(src);
				const metadata = await client.withConfig({ projectId, dataset, useCdn: true }).fetch<{
					blurHash?: string | null;
					lqip?: string | null;
				} | null>("*[_id == $id][0].metadata{blurHash, lqip}", { id: `image-${assetId}-${width}x${height}-${extension}` }, { cache: "no-store" });
				if (metadata?.blurHash || metadata?.lqip?.startsWith("data:image/")) return metadata;
			}
			const input = await readImage(src);
			if (!input) return null;
			const image = sharp(input, { limitInputPixels: 40_000_000 });
			if ((await image.metadata()).format === "svg") return null;
			const preview = await image
				.rotate()
				.resize(16, 16, { fit: "inside", withoutEnlargement: true })
				.blur()
				.webp({ quality: 30 })
				.toBuffer();
			return { lqip: `data:image/webp;base64,${preview.toString("base64")}` };
		} catch {
			// A missing preview must never prevent an article or its image from rendering.
			return null;
		}
	},
	["mdx-image-placeholder-v2"],
	{ revalidate: 86400 }
);

export const mdxImagePlaceholder = cache(async (src?: string): Promise<ImagePlaceholderProps> => {
	return imagePlaceholder(src ? await resolvePlaceholder(src) : undefined);
});
