"use client";

import { useState } from "react";

import { ImageGallery } from "../projects/image-gallery";

export default function Lightbox({ children }: { children: React.ReactNode }): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<a className="cursor-pointer" onClick={() => setIsOpen(true)}>
				{children}
			</a>
			{isOpen && <ImageGallery close={() => setIsOpen(false)}>{children}</ImageGallery>}
		</>
	);
}
