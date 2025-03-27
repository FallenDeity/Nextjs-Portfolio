"use client";

import { motion, MotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect } from "react";

import { cn } from "@/lib/utils";

const fontSize = 30;
const padding = 15;
const height = fontSize + padding;

export function AnimatedCounter({
	value,
	places,
	className,
}: {
	value: number;
	places: number;
	className?: string;
}): React.JSX.Element {
	return (
		<div
			style={{ fontSize }}
			className={cn(
				"bg-card text-card-foreground flex space-x-3 overflow-hidden rounded-md px-2 leading-none",
				className
			)}>
			{[...Array(places).keys()].map((i) => (
				<Digit place={10 ** (places - i - 1)} value={value} key={i} />
			))}
		</div>
	);
}

function Digit({ place, value }: { place: number; value: number }): React.JSX.Element {
	const valueRoundedToPlace = Math.floor(value / place);
	const animatedValue = useSpring(valueRoundedToPlace, { damping: 20, stiffness: 300 });

	useEffect(() => {
		animatedValue.set(valueRoundedToPlace);
	}, [animatedValue, valueRoundedToPlace]);

	return (
		<div style={{ height }} className="relative w-[0.8ch] tabular-nums">
			{[...Array(10).keys()].map((i) => (
				<Number key={i} mv={animatedValue} number={i} />
			))}
		</div>
	);
}

function Number({ mv, number }: { mv: MotionValue; number: number }): React.JSX.Element {
	const y = useTransform(mv, (latest) => {
		const placeValue = latest % 10;
		const offset = (10 + number - placeValue) % 10;
		let memo = offset * height;
		if (offset > 5) {
			memo -= 10 * height;
		}
		return -memo;
	});

	return (
		<motion.span style={{ y }} className="absolute inset-0 flex items-center justify-center">
			{number}
		</motion.span>
	);
}
