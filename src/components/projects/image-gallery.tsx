"use client";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-pager.css";

import { GalleryItem } from "lightgallery/lg-utils";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgPager from "lightgallery/plugins/pager";
import lgRotate from "lightgallery/plugins/rotate";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGallery from "lightgallery/react";
import Image from "next/image";
import React from "react";

export function Gallery({ images }: { images: GalleryItem[] }): React.ReactElement {
	return (
		<div className="scrollbar-hide max-w-5xl overflow-x-auto">
			<LightGallery plugins={[lgThumbnail, lgZoom, lgRotate, lgFullscreen, lgPager]}>
				{images.map((image, index) => (
					<a
						key={index}
						href={image.src}
						data-lg-size={`${image.width}-${image.height}`}
						className="w-[480px]">
						<Image
							src={image.thumb ?? ""}
							alt={image.alt ?? ""}
							width={480}
							height={128}
							className="h-full w-full rounded-md object-contain"
						/>
					</a>
				))}
			</LightGallery>
		</div>
	);
}
