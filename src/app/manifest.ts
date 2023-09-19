import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Triyan | Portfolio",
		short_name: "Triyan",
		description:
			"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.",
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#5c09b5",
		icons: [
			{
				src: "/icons/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icons/icon-256x256.png",
				sizes: "256x256",
				type: "image/png",
			},
			{
				src: "/icons/icon-384x384.png",
				sizes: "384x384",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icons/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
