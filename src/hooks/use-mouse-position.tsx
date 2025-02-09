"use client";

import * as React from "react";

export interface Position {
	x: number | null;
	y: number | null;
	scrollX: number;
	scrollY: number;
}

export function useMousePosition(): [Position] {
	const [state, setState] = React.useState<Position>({
		x: null,
		y: null,
		scrollX: 0,
		scrollY: 0,
	});

	React.useLayoutEffect(() => {
		const handleMouseMove = (event: MouseEvent): void => {
			const newState = {
				x: event.clientX,
				y: event.clientY,
			};

			setState((s) => ({
				...s,
				...newState,
			}));
		};

		document.addEventListener("mousemove", handleMouseMove);

		return (): void => document.removeEventListener("mousemove", handleMouseMove);
	}, []);

	React.useLayoutEffect(() => {
		const handleScroll = (): void => {
			setState((s) => ({
				...s,
				scrollX: window.scrollX,
				scrollY: window.scrollY,
			}));
		};

		window.addEventListener("scroll", handleScroll);

		return (): void => window.removeEventListener("scroll", handleScroll);
	}, []);

	return [state];
}
