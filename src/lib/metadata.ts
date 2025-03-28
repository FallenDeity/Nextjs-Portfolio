import { Metadata, Viewport } from "next";

export const metadataConfig: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
	title: {
		default: "Triyan Mukherjee",
		template: `%s • Triyan Mukherjee`,
	},
	description:
		"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.",
	applicationName: "Triyan Mukherjee",
	authors: [{ name: "Triyan Mukherjee", url: "https://github.com/FallenDeity" }],
	category: "Personal Website",
	keywords: [
		"personal",
		"blog",
		"homepage",
		"portfolio",
		"about",
		"me",
		"tech",
		"programming",
		"knowledge",
		"triyan",
		"developer",
		"Student",
		"fallendeity",
		"software",
		"engineer",
	],
	robots: {
		follow: true,
		index: true,
	},
	openGraph: {
		siteName: "Triyan Mukherjee",
		description:
			"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.",
		type: "website",
		url: "/",
		emails: ["triyanmukherjee@gmail.com"],
		images: [
			{
				url: "/open-graph.png",
				alt: "Triyan Mukherjee",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		title: "Triyan Mukherjee",
		card: "summary_large_image",
		description:
			"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.",
		images: [
			{
				url: "/open-graph.png",
				alt: "Triyan Mukherjee",
				width: 1200,
				height: 630,
			},
		],
	},
};

export const viewportConfig: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#3D73AD" },
		{ media: "(prefers-color-scheme: light)", color: "#2DA492" },
	],
	colorScheme: "dark light",
	width: "device-width",
	initialScale: 1,
};
