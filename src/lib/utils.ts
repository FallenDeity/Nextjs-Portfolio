import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const meta = {
	title: "Triyan | Portfolio",
	metadataBase: new URL(String(process.env.NEXT_PUBLIC_BASE_URL)),
	description:
		"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.",
	keywords: ["Triyan", "Portfolio", "Full-stack", "Developer", "Student", "FallenDeity", "Software", "Engineer"],
	authors: [{ name: "FallenDeity" }],
	robots: {
		follow: true,
		index: true,
		nocache: true,
	},
	openGraph: {
		title: "Triyan | Portfolio",
		description:
			"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.",
		images: "/og.png",
		type: "website",
	},
	themeColor: "#5c09b5",
};
