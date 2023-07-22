import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const meta = {
	title: "Triyan | Portfolio",
	metadataBase: new URL(String(process.env.NEXT_PUBLIC_BASE_URL)),
	description: "Hi, I'm Triyan. I'm a full-stack developer.",
	keywords: ["Triyan", "Portfolio", "Full-stack", "Developer", "Student", "FallenDeity"],
	authors: [{ name: "FallenDeity" }],
	robots: {
		follow: true,
		index: false,
		nocache: true,
	},
	openGraph: {
		title: "Triyan | Portfolio",
		description: "Hi, I'm Triyan. I'm a full-stack developer.",
		images: "/logo.png",
		type: "website",
	},
	themeColor: "#5c09b5",
};
