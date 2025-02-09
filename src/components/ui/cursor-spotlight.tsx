"use client";

import React from "react";

import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

export interface CursorSpotlightProps {
	from: string;
	via: string;
	to: string;
	opacity?: string;
	filter?: string;
	className?: string;
}

export const CursorSpotlight: React.FC<CursorSpotlightProps> = ({ from, via, to, opacity, filter, className }) => {
	const cursorRef = React.useRef<HTMLDivElement>(null);
	const [mouse] = useMousePosition();

	if (mouse.x == null || mouse.y == null) return null;

	const gradientShape = (): string => {
		if (mouse.x == null || mouse.y == null) return "50% 50%";
		const x = mouse.x + mouse.scrollX;
		const y = mouse.y + mouse.scrollY;
		return `${x}px ${y}px`;
	};

	return (
		<div
			ref={cursorRef}
			className={cn(
				"animate-appear pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0",
				className
			)}
			style={{
				background: `radial-gradient(125px circle at ${gradientShape()}, ${from} 0%, ${via} 33%, ${to} 66%, transparent 100%)`,
				filter: filter || "blur(75px)",
				opacity: opacity || "20%",
			}}
		/>
	);
};

export default CursorSpotlight;
