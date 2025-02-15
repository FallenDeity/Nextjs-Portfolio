"use client";

import React from "react";

import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

export interface CursorSpotlightProps {
	opacity?: string;
	filter?: string;
	className?: string;
}

export const CursorSpotlight: React.FC<CursorSpotlightProps> = ({ opacity, filter, className }) => {
	const cursorRef = React.useRef<HTMLDivElement>(null);
	const [mouse] = useMousePosition();

	if (mouse.x == null || mouse.y == null) return null;

	const circle_size = 400;
	const centerX = mouse.x + window.pageXOffset;
	const centerY = mouse.y + window.pageYOffset;

	const left = centerX - circle_size / 2;
	const top = centerY - circle_size / 2;
	console.log("cursor scrolling", window.pageXOffset, window.pageYOffset);

	return (
		<div
			ref={cursorRef}
			className={cn(
				"animate-appear pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0",
				className
			)}
			style={{
				maskImage: `radial-gradient(${circle_size / 2}px circle at center, white, transparent)`,
				filter: filter || "blur(75px)",
				opacity: opacity || "20%",
				width: `${circle_size}px`,
				height: `${circle_size}px`,
				left: `${left}px`,
				top: `${top}px`,
				background: `linear-gradient(135deg, var(--cursor-from), var(--cursor-via), var(--cursor-to), var(--cursor-from))`,
			}}
		/>
	);
};

export default CursorSpotlight;
