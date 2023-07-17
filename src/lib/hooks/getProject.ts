"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface Project {
	title: string;
	description: string;
	tags: {
		tag: string;
		color: string;
	}[];
	image: string;
	link?: string;
	source_code_link?: string;
}

export default function useProject(): Project[] {
	const [project, setProjects] = React.useState<Project[]>([]);
	React.useEffect(() => {
		async function getProjects(): Promise<void> {
			const projects = await sanityClient.fetch<Project[]>('*[_type == "project"]');
			projects.forEach((project) => {
				project.image = urlFor(project.image).url();
			});
			setProjects(projects);
		}
		void getProjects();
	}, []);
	return project;
}
