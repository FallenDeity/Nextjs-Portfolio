"use client";

import { decode } from "blurhash";
import Image, { type ImageProps } from "next/image";
import { imageLoader } from "next-sanity/image";
import React, { useEffect, useRef, useState } from "react";

import { isSanityImageUrl } from "@/lib/image";

const isUnoptimizedFormat = (src: ImageProps["src"]): boolean =>
	typeof src === "string" && /\.(?:gif|svg)(?:$|\?)/i.test(src);

type SanityImageProps = Omit<ImageProps, "loader"> & { blurHash?: string };

export default function SanityImage({ blurHash, ...props }: SanityImageProps): React.JSX.Element {
	const imageRef = useRef<HTMLImageElement>(null);
	const [decoded, setDecoded] = useState<{ hash: string; url: string } | null>(null);
	useEffect(() => {
		if (!blurHash || (imageRef.current?.complete && imageRef.current.naturalWidth > 0)) return;
		try {
			const pixels = decode(blurHash, 32, 32);
			const canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			const context = canvas.getContext("2d");
			if (!context) return;
			const imageData = context.createImageData(32, 32);
			imageData.data.set(pixels);
			context.putImageData(imageData, 0, 0);
			setDecoded({ hash: blurHash, url: canvas.toDataURL() });
		} catch {
			// Invalid hashes must not prevent the full image from loading.
			setDecoded(null);
		}
	}, [blurHash, props.src]);
	const decodedUrl = decoded && decoded.hash === blurHash ? decoded.url : undefined;
	const sanityImage = isSanityImageUrl(props.src);
	const unoptimized = props.unoptimized ?? (isUnoptimizedFormat(props.src) || props.src === "/pdf.webp");

	// Unsupported formats must bypass Sanity transforms as well as Next.js optimization.
	const src =
		typeof props.src === "string" && sanityImage && unoptimized && isUnoptimizedFormat(props.src)
			? props.src.split("?")[0]
			: props.src;

	return (
		<Image
			{...props}
			ref={imageRef}
			placeholder={decodedUrl ? "blur" : props.placeholder}
			blurDataURL={decodedUrl ?? props.blurDataURL}
			src={src}
			loader={sanityImage && !unoptimized ? imageLoader : undefined}
			unoptimized={unoptimized}
		/>
	);
}
