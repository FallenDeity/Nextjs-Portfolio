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
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
	};
}
