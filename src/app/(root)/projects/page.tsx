import { Metadata } from "next";

import ProjectListing from "@/components/projects/project-listing";
import { sanityFetch } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Welcome to my projects page! Explore an assortment of meticulously crafted projects I've personally worked on and take pride in.",
	keywords: ["projects", "portfolio", "programming", "softwares", "apps", "tools", "websites", "github"],
	openGraph: {
		siteName: "Projects",
		url: "/projects",
		images: [
			{
				url: "/projects-open-graph.png",
				alt: "Projects",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: [
			{
				url: "/projects-open-graph.png",
				alt: "Projects",
				width: 1200,
				height: 630,
			},
		],
	},
};

export default async function ProjectsPage(): Promise<React.ReactElement> {
	const projects = await sanityFetch({
		query: PROJECTS_QUERY,
		tags: ["project", "category"],
	});

	return <ProjectListing projects={projects} />;
}
