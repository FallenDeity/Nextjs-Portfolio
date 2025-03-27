import { Inter, Lato, Roboto, Source_Sans_3 } from "next/font/google";

export const inter = Inter({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Arial", "sans-serif"],
});

export const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Arial", "sans-serif"],
});

export const sourceSans = Source_Sans_3({
	weight: ["300", "400", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Arial", "sans-serif"],
});

export const lato = Lato({
	weight: ["100", "300", "400", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Arial", "sans-serif"],
});
