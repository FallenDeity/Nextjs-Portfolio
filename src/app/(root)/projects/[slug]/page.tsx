import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import ProjectDetail from "@/components/projects/project-details";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { NEXT_PREV_PROJECTS_QUERY, PROJECT_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const project = await sanityFetch({
		query: PROJECT_QUERY,
		params: { slug: slug },
		tags: [`project:${slug}`, "category"],
	});

	if (!project) {
		return {
			title: "Project not found",
			description: "The requested project could not be found.",
			keywords: ["404", "not found", "error"],
		};
	}

	return {
		title: project.title,
		description: project.excerpt,
		keywords: [project.title, ...(project.technologies || []), ...project.tags.map((tag) => tag.slug.current)],
		openGraph: {
			siteName: "Triyan Mukherjee",
			type: "article",
			title: project.title,
			description: project.excerpt,
			tags: project.tags.map((tag) => tag.slug.current),
			url: `/projects/${project.slug.current}`,
			images: [
				{
					url: urlFor(project.image).url() || "",
					alt: project.image.alt || "Image",
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: project.title,
			description: project.excerpt,
			site: "/",
			images: [
				{
					url: urlFor(project.image).url() || "",
					alt: project.image.alt || "Image",
					width: 1200,
					height: 630,
				},
			],
		},
	};
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const projects = await sanityFetch({
		query: PROJECTS_QUERY,
		revalidate: false,
	});

	const slugs = projects.map((project) => project.slug?.current || "").filter((slug) => slug);

	return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }): Promise<React.ReactElement> {
	const { slug } = await params;
	const project = await sanityFetch({
		query: PROJECT_QUERY,
		params: { slug: slug },
		tags: [`project:${slug}`, "category"],
	});
	const next_prev = await sanityFetch({
		query: NEXT_PREV_PROJECTS_QUERY,
		params: { slug: slug },
		tags: [`project:${slug}`, "category"],
	});
	if (!project) {
		return redirect("/404");
	}
	return <ProjectDetail project={project} nextPrev={next_prev} />;
}
