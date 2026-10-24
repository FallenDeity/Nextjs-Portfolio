"use client";

import type { GalleryItem } from "lightgallery/lg-utils";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import Image from "@/components/ui/sanity-image";
import type { ImagePlaceholderProps } from "@/lib/image";
import { CARD_STYLE_STRING, cn } from "@/lib/utils";

import { Marquee } from "../magicui/marquee";

const ProjectGalleryViewer = dynamic(
	() => import("./image-gallery-viewer").then((module) => module.ProjectGalleryViewer),
	{ ssr: false }
);

export function Gallery({
	images,
}: {
	images: (GalleryItem & { placeholderProps?: ImagePlaceholderProps })[];
}): React.ReactElement {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	return (
		<>
			<Marquee pauseOnHover className="scrollbar-hide relative max-w-5xl overflow-x-auto">
				<div className="lg-gallery-styles">
					{images.map((image, index) => {
						const thumbnailWidth = 480; // Set your desired thumbnail width
						const aspectRatio = parseFloat(image.width as string) / parseFloat(image.height as string);
						const thumbnailHeight = Math.max(1, Math.round(thumbnailWidth / aspectRatio));
						return (
							<a
								key={index}
								href={image.src}
								onClick={(event) => {
									event.preventDefault();
									setActiveIndex(index);
								}}
								data-lg-size={`${image.width}-${image.height}`}
								style={{ width: `${thumbnailWidth}px`, height: `${thumbnailHeight}px` }} // Dynamic thumbnail size
								className={cn("block max-h-56", CARD_STYLE_STRING)}>
								<Image
									src={image.thumb ?? ""}
									{...image.placeholderProps}
									alt={image.alt ?? ""}
									width={thumbnailWidth}
									height={thumbnailHeight}
									sizes="480px"
									className="h-full w-full rounded-md object-contain"
									loading="lazy"
								/>
							</a>
						);
					})}
				</div>
			</Marquee>
			{activeIndex !== null && (
				<ProjectGalleryViewer images={images} index={activeIndex} close={() => setActiveIndex(null)} />
			)}
		</>
	);
}
