import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const CARD_STYLE_STRING =
	"bg-card/40 transform-gpu [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]";

function string_to_color(str: string, prc?: number): string {
	// Check for optional lightness/darkness
	prc = prc || -10;

	// Generate a Hash for the String
	const hash = function (word: string): number {
		let h = 0;
		for (let i = 0; i < word.length; i++) {
			h = word.charCodeAt(i) + ((h << 5) - h);
		}
		return h;
	};

	// Change the darkness or lightness
	const shade = function (color: string, prc: number): string {
		const num = parseInt(color, 16),
			amt = Math.round(2.55 * prc),
			R = (num >> 16) + amt,
			G = ((num >> 8) & 0x00ff) + amt,
			B = (num & 0x0000ff) + amt;
		return (
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1);
	};

	// Convert init to an RGBA
	const int_to_rgba = function (i: number): string {
		const color =
			((i >> 24) & 0xff).toString(16) +
			((i >> 16) & 0xff).toString(16) +
			((i >> 8) & 0xff).toString(16) +
			(i & 0xff).toString(16);
		return color;
	};

	return shade(int_to_rgba(hash(str)), prc);
}

export function colorFromString(text: string, theme?: "dark" | "light"): string {
	const hex = `#${string_to_color(text, theme === "dark" ? 10 : -15)}`;
	return hex;
}

export const formatDate = (date: string, showDay = false): string => {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: showDay ? "numeric" : undefined,
	});
};

export const CUSTOM_LOGOS = ["java"];
