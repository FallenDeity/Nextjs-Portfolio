"use client";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-pager.css";

import { InitDetail } from "lightgallery/lg-events";
import { GalleryItem } from "lightgallery/lg-utils";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgPager from "lightgallery/plugins/pager";
import lgRotate from "lightgallery/plugins/rotate";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGallery from "lightgallery/react";
import Image from "next/image";
import React from "react";

import { CARD_STYLE_STRING, cn } from "@/lib/utils";

import { Marquee } from "../magicui/marquee";

export function Gallery({ images }: { images: GalleryItem[] }): React.ReactElement {
	return (
		<Marquee pauseOnHover className="scrollbar-hide relative max-w-5xl overflow-x-auto">
			<LightGallery
				elementClassNames="lg-gallery-styles"
				plugins={[lgThumbnail, lgZoom, lgRotate, lgFullscreen, lgPager]}>
				{images.map((image, index) => {
					const thumbnailWidth = 480; // Set your desired thumbnail width
					const aspectRatio = parseFloat(image.width as string) / parseFloat(image.height as string);
					const thumbnailHeight = thumbnailWidth / aspectRatio;

					return (
						<a
							key={index}
							href={image.src}
							data-lg-size={`${image.width}-${image.height}`}
							style={{ width: `${thumbnailWidth}px`, height: `${thumbnailHeight}px` }} // Dynamic thumbnail size
							className={cn("block max-h-56", CARD_STYLE_STRING)}>
							<Image
								src={image.thumb ?? ""}
								alt={image.alt ?? ""}
								width={thumbnailWidth}
								height={thumbnailHeight}
								className="h-full w-full rounded-md object-contain"
								loading="lazy"
							/>
						</a>
					);
				})}
			</LightGallery>
		</Marquee>
	);
}

// A component which displays lightgallery
export function ImageGallery({
	children,
	close,
}: {
	children: React.ReactNode;
	close?: () => void;
}): React.ReactElement {
	const onInit = (details: InitDetail): void => {
		details.instance.openGallery();
	};
	return (
		<LightGallery
			onInit={onInit}
			thumbnail={false}
			plugins={[lgZoom, lgRotate, lgFullscreen, lgPager]}
			onBeforeClose={close}>
			<a href={((children as React.JSX.Element).props as { src: string }).src} className="hidden">
				{children}
			</a>
		</LightGallery>
	);
}
