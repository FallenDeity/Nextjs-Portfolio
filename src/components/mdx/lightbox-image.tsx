"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { cn } from "@/lib/utils";

const ImageGallery = dynamic(() => import("../projects/image-gallery-viewer").then((module) => module.ImageGallery), {
	ssr: false,
});

export default function Lightbox({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<a className={cn("cursor-pointer", className)} onClick={() => setIsOpen(true)}>
				{children}
			</a>
			{isOpen && <ImageGallery close={() => setIsOpen(false)}>{children}</ImageGallery>}
		</>
	);
}
