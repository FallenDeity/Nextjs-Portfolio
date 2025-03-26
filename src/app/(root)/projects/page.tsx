import ProjectListing from "@/components/projects/project-listing";
import { sanityFetch } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

export default async function ProjectsPage(): Promise<React.ReactElement> {
	const projects = await sanityFetch({
		query: PROJECTS_QUERY,
		tags: ["project", "category"],
	});

	return <ProjectListing projects={projects} />;
}
