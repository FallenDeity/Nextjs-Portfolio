"use client";

import { Variants } from "framer-motion";
import { HTMLMotionProps, motion, Transition, useInView } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const easeTransitions = {
	default: [0.25, 0.1, 0.25, 1],
	transform: [0.42, 0, 0.58, 1],
	opacity: [0.25, 0.1, 0.25, 1],
	clipPath: [0.6, 0.04, 0.98, 0.335],
};
export type TransformDirectionType = "top" | "bottom" | "left" | "right" | "z";
export const transformVariants = (direction?: TransformDirectionType): Variants => ({
	hidden: {
		x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
		y: direction === "top" ? "-100%" : direction === "bottom" ? "100%" : 0,
		scale: direction === "z" ? 0 : 1,
		opacity: 0,
	},
	visible: {
		x: 0,
		y: 0,
		scale: 1,
		opacity: 1,
	},
});

interface WordProps {
	word: string;
	transition?: Transition;
	direction?: TransformDirectionType;
}
const transitionConfig = { ease: easeTransitions["default"], duration: 0.5 };
function Word({ word, transition = transitionConfig, direction = "bottom" }: WordProps): React.ReactElement {
	const characters = word.split("");
	return (
		<span className="inline-block align-top text-nowrap">
			{characters.map((char, index) => (
				<span key={index} className="inline-block">
					<motion.span
						className="inline-block"
						variants={transformVariants(direction)}
						transition={transition}>
						{char}
					</motion.span>
				</span>
			))}
		</span>
	);
}

interface staggerTextProps extends HTMLMotionProps<"div"> {
	text: string;
	stagger?: number;
	transition?: Transition;
	direction?: TransformDirectionType;
	className?: string;
}
function StaggerText({
	text,
	stagger = 0.05,
	transition,
	direction,
	className,
	...props
}: staggerTextProps): React.ReactElement {
	const words = text.split(" ");
	const ref = React.useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, {
		once: true,
		amount: 0.3,
	});

	return (
		<motion.div
			ref={ref}
			transition={{ staggerChildren: stagger }}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			className={cn("relative", className)}
			{...props}>
			{words.map((word, index) => (
				<React.Fragment key={index}>
					<Word transition={transition} direction={direction} word={word} />
					{index < words.length - 1 && " "}
				</React.Fragment>
			))}
		</motion.div>
	);
}

export { StaggerText };
