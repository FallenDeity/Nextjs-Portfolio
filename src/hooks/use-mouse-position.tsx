"use client";

import * as React from "react";

export interface Position {
	x: number | null;
	y: number | null;
}

export function useMousePosition(): [Position] {
	const [state, setState] = React.useState<Position>({
		x: null,
		y: null,
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

	return [state];
}
