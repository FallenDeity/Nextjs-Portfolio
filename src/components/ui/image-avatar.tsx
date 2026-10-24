"use client";

import { useState } from "react";

import Image from "@/components/ui/sanity-image";
import type { ImagePlaceholderProps } from "@/lib/image";
import { cn } from "@/lib/utils";

export function ImageAvatar({
	src,
	alt,
	size = 120,
	className,
	fallback,
	...placeholder
}: ImagePlaceholderProps & {
	src: string;
	alt: string;
	size?: number;
	className?: string;
	fallback?: string;
}): React.ReactElement {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	return (
		<span
			role="img"
			aria-label={alt}
			className={cn(
				"bg-muted relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
				className
			)}
			style={{ width: size, height: size }}>
			<span aria-hidden="true">{fallback ?? (alt.charAt(0) || "T")}</span>
			{src && failedSrc !== src && (
				<Image
					src={src}
					alt=""
					width={size}
					height={size}
					sizes={`${size}px`}
					className="absolute inset-0 h-full w-full object-cover"
					{...placeholder}
					onError={() => setFailedSrc(src)}
				/>
			)}
		</span>
	);
}
