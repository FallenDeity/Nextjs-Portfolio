"use client";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-expect-error no types for colorthief
import ColorThief from "colorthief/dist/color-thief.mjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import React from "react";
import { createNoise2D } from "simplex-noise";

import { getSpotifyStatus, SpotifyStatus } from "@/lib/actions";
import { cn } from "@/lib/utils";

import { Progress } from "../ui/progress";

interface AudioVisualizerProps {
	width: number;
	height: number;
	barWidth: number;
	gap: number;
	barColor: string;
	pause?: boolean;
	className?: string;
}

function AudioVisualizer({
	width,
	height,
	barWidth,
	gap,
	barColor,
	pause,
	className,
}: AudioVisualizerProps): React.ReactElement {
	const bars = Math.floor(width / (barWidth + gap));
	const barHeight = height / 2;
	const [values, setValues] = React.useState<number[]>(Array.from({ length: bars }, () => 0));
	const noise = createNoise2D();

	React.useEffect(() => {
		if (pause) {
			setValues(Array.from({ length: bars }, () => Math.random()));
			return;
		}

		let time = 0;
		const interval = setInterval(() => {
			const newValues = values.map((_, i) => {
				const x = i * 0.1;
				const y = noise(x, time * 0.1);
				return Math.abs(y);
			});
			setValues(newValues);
			time += 0.1;
		}, 1000 / 30);
		return (): void => clearInterval(interval);
	}, [barHeight, pause]);

	const lerp = (a: number, b: number, t: number): number => a * (1 - t) + b * t;

	return (
		<motion.div
			className={cn(className, "flex h-full w-full items-center justify-center")}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			{values.map((value, i) => (
				<motion.div
					key={i}
					initial={{ height: 0 }}
					animate={{ height: `${lerp(0, barHeight, value)}px` }}
					exit={{ height: 0 }}
					transition={{ duration: 0.3 }}
					style={{
						width: barWidth,
						marginRight: gap,
						backgroundColor: barColor,
					}}
				/>
			))}
		</motion.div>
	);
}

export default function SpotifyStatusCard(): React.ReactElement {
	const { resolvedTheme } = useTheme();
	const [status, setStatus] = React.useState<SpotifyStatus | undefined>(undefined);
	const [progress, setProgress] = React.useState(0);
	const [colorPalette, setColorPalette] = React.useState<number[][] | undefined>(undefined);
	const [gradientColor, setGradientColor] = React.useState<string | undefined>(undefined);
	const colorThief = new ColorThief();

	React.useEffect(() => {
		const updateStatus = async (): Promise<void> => {
			const status = await getSpotifyStatus();
			setStatus(status);
		};

		if (status && status.is_playing && progress >= 100) {
			void updateStatus();
			return;
		}

		void updateStatus();
	}, [progress]);

	React.useEffect(() => {
		if (!status) {
			return;
		}
		const interval = setInterval(() => {
			const total = status.item.duration_ms;
			const last_progress = status.progress_ms;
			const last_updated = status.last_updated;
			const current = Date.now();
			const elapsed = current - last_updated;
			const progress = last_progress + elapsed;
			setProgress((progress / total) * 100);
		}, 1000);
		return (): void => clearInterval(interval);
	}, [status]);

	React.useEffect(() => {
		if (!colorPalette) return;
		const pick = (arr: number[][], resolvedTheme: "dark" | "light"): number[][] => {
			// Calculate luminance
			const luminance = (rgb: number[]): number => 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];

			// Categorize colors into dark and light
			const darkColors = arr.filter((color) => luminance(color) <= 120);
			const lightColors = arr.filter((color) => luminance(color) >= 150);

			// Select the correct color set based on the theme
			const colorPool = resolvedTheme === "dark" ? darkColors : lightColors;

			if (colorPool.length < 2) {
				// Fallback: Pick any two colors if we don't have enough in the selected category
				const shuffled = arr.sort(() => 0.5 - Math.random());
				return [shuffled[0], shuffled[1]];
			}

			// Pick one base color
			const baseColor = colorPool[Math.floor(Math.random() * colorPool.length)];

			// Find a second color that forms a good gradient
			const secondColor = colorPool.reduce((best, current) => {
				const similarity =
					Math.abs(baseColor[0] - current[0]) +
					Math.abs(baseColor[1] - current[1]) +
					Math.abs(baseColor[2] - current[2]);
				return similarity <
					Math.abs(baseColor[0] - best[0]) +
						Math.abs(baseColor[1] - best[1]) +
						Math.abs(baseColor[2] - best[2])
					? current
					: best;
			}, colorPool[0]);

			return [baseColor, secondColor];
		};

		const color = pick(colorPalette || [], resolvedTheme as "dark" | "light");
		const gradient = `linear-gradient(270deg, rgba(${color[0].join(",")}, 0.4), rgba(${color[1].join(",")}, 0.4))`;
		setGradientColor(gradient);
	}, [colorPalette, resolvedTheme]);

	const formatProgress = (progress: number): string => {
		const minutes = Math.floor(progress / 60000);
		const seconds = ((progress % 60000) / 1000).toFixed(0);
		return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
	};

	return (
		<div className="flex h-full w-full flex-col items-center">
			{status && status.is_playing ? (
				<div className="flex w-full flex-col space-y-2">
					<div
						className={`relative flex w-full flex-row space-x-2 rounded-md border p-3 ${!gradientColor && "bg-card/60"}`}
						style={{ background: gradientColor }}>
						<Image
							src={status.item.album.images[0].url}
							alt={status.item.album.name}
							onLoadingComplete={(img): void => {
								const palette = colorThief.getPalette(img, 20) as number[][];
								setColorPalette(palette);
							}}
							className="h-16 w-16 rounded-md"
							width={64}
							height={64}
						/>
						<div className="absolute top-3 right-0">
							<AudioVisualizer
								width={72}
								height={44}
								barWidth={2}
								gap={1}
								barColor={colorPalette ? `rgb(${colorPalette[3].join(",")})` : "white"}
								className="top-0 right-0 h-11"
							/>
						</div>
						<div className="flex h-full w-full flex-col items-start justify-between">
							<div className="flex w-full flex-col">
								<div className="text-md line-clamp-1 w-[60%] font-bold text-ellipsis">
									{status.item.name}
								</div>
								<div className="text-muted-foreground text-xs">
									{status.item.artists.map((artist) => artist.name).join(", ")}
								</div>
							</div>
							<div className="flex w-full flex-row items-center justify-between">
								<Progress value={progress} className="h-1 w-[75%]" />
								<div className="text-muted-foreground text-xs">
									{formatProgress((progress / 100) * status.item.duration_ms)} /{" "}
									{formatProgress(status.item.duration_ms)}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex w-full flex-col space-y-2">
					<div className="bg-card/60 relative flex w-full flex-row space-x-2 rounded-md border p-3">
						<Image
							src="/spotify.png"
							alt="Spotify"
							className="h-15 w-15 rounded-md"
							width={64}
							height={64}
						/>
						<div className="absolute top-3 right-0">
							<AudioVisualizer
								width={72}
								height={44}
								barWidth={2}
								gap={1}
								pause
								barColor={resolvedTheme === "dark" ? "white" : "black"}
								className="top-0 right-0 h-11"
							/>
						</div>
						<div className="flex h-full w-full flex-col items-start justify-between">
							<div className="flex h-full w-full flex-col">
								<span className="text-md line-clamp-1 w-[60%] font-bold text-ellipsis">
									Not Playing
								</span>
								<div className="text-muted-foreground text-xs">Spotify</div>
							</div>
							<div className="flex w-full flex-row items-center justify-between">
								<Progress value={0} className="h-1 w-[75%]" />
								<span className="text-muted-foreground text-xs">0:00 / 0:00</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
