import { redirect } from "next/navigation";
import React from "react";

import ProjectDetail from "@/components/projects/project-details";
import { sanityFetch } from "@/sanity/lib/client";
import { NEXT_PREV_PROJECTS_QUERY, PROJECT_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";

export const dynamicParams = true;

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
