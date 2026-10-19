"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { ImageGallery } from "../projects/image-gallery";

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
