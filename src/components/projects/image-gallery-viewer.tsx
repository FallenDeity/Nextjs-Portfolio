"use client";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-pager.css";

import { InitDetail } from "lightgallery/lg-events";
import type { GalleryItem } from "lightgallery/lg-utils";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgPager from "lightgallery/plugins/pager";
import lgRotate from "lightgallery/plugins/rotate";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGallery from "lightgallery/react";
import React from "react";

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

export function ProjectGalleryViewer({
	images,
	index,
	close,
}: {
	images: GalleryItem[];
	index: number;
	close: () => void;
}): React.ReactElement {
	return (
		<LightGallery
			dynamic
			dynamicEl={images}
			onInit={({ instance }) => instance.openGallery(index)}
			plugins={[lgThumbnail, lgZoom, lgRotate, lgFullscreen, lgPager]}
			onBeforeClose={close}
		/>
	);
}
