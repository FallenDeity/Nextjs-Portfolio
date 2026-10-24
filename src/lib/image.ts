import { isBlurhashValid } from "blurhash";
import type { ImageProps } from "next/image";

export type ImagePlaceholderProps = Pick<ImageProps, "placeholder" | "blurDataURL"> & { blurHash?: string };

export function imagePlaceholder(image: unknown): ImagePlaceholderProps {
	if (
		image &&
		typeof image === "object" &&
		"blurHash" in image &&
		typeof image.blurHash === "string" &&
		isBlurhashValid(image.blurHash).result
	) {
		return { blurHash: image.blurHash, placeholder: "empty" };
	}
	if (
		image &&
		typeof image === "object" &&
		"lqip" in image &&
		typeof image.lqip === "string" &&
		image.lqip.startsWith("data:image/")
	) {
		return { placeholder: "blur", blurDataURL: image.lqip };
	}
	return { placeholder: "empty" };
}

export const isSanityImageUrl = (src: unknown): src is string => {
	if (typeof src !== "string") return false;
	try {
		return new URL(src).hostname === "cdn.sanity.io";
	} catch {
		return false;
	}
};
