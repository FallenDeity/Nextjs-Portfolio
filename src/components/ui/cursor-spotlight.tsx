"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React from "react";

import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

export interface CursorSpotlightProps {
	opacity?: string;
	filter?: string;
	className?: string;
	springConfig?: { stiffness: number; damping: number };
	size?: number; // Spotlight size
}

export const CursorSpotlight: React.FC<CursorSpotlightProps> = ({
	opacity = "20%",
	filter = "blur(75px)",
	className,
	springConfig = { stiffness: 150, damping: 20 },
	size = 400,
}) => {
	const [mouse] = useMousePosition();

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const smoothX = useSpring(x, springConfig);
	const smoothY = useSpring(y, springConfig);

	React.useEffect(() => {
		if (mouse.x == null || mouse.y == null) return;

		const centerX = mouse.x + window.pageXOffset;
		const centerY = mouse.y + window.pageYOffset;
		x.set(centerX - size / 2);
		y.set(centerY - size / 2);
	}, [mouse.x, mouse.y, x, y, size]);

	return (
		<motion.div
			animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
			transition={{
				scale: {
					duration: 2, // breathing effect duration
					ease: "easeInOut",
					repeat: Infinity,
					repeatType: "loop",
				},
				rotate: {
					duration: 5, // rotating effect duration (different from breathing)
					ease: "linear", // continuous rotation without easing
					repeat: Infinity,
					repeatType: "loop",
				},
			}}
			className={cn("pointer-events-none fixed -z-1 opacity-0", className)}
			style={{
				position: "absolute",
				maskImage: `radial-gradient(${size / 2}px circle at center, white, transparent)`,
				WebkitMaskImage: `radial-gradient(${size / 2}px circle at center, white, transparent)`,
				filter,
				opacity,
				width: `${size}px`,
				height: `${size}px`,
				background: `linear-gradient(135deg, var(--cursor-from), var(--cursor-via), var(--cursor-to), var(--cursor-from))`,
				left: 0,
				top: 0,
				translateX: smoothX,
				translateY: smoothY,
			}}
		/>
	);
};

export default CursorSpotlight;
