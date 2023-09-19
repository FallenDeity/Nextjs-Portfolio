"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface Project {
	_id: string;
	title: string;
	description: string;
	tags: {
		tag: string;
		color: string;
	}[];
	image: string;
	link?: string;
	source_code_link?: string;
	_createdAt: string;
}

export default function useProject(): Project[] {
	const [project, setProjects] = React.useState<Project[]>([]);
	React.useEffect(() => {
		async function fetchProject(): Promise<void> {
			const query = '*[_type == "project"]';
			const project = await sanityClient.fetch<Project[]>(query);
			project.forEach((project) => {
				project.image = urlFor(project.image).width(600).auto("format").url();
			});
			setProjects(project);
		}
		void fetchProject();
		const subscription = sanityClient.listen("*[_type == 'project']").subscribe((record) => {
			if (record.transition === "appear") {
				try {
					const project = record.result as unknown as Project;
					project.image = urlFor(project.image).width(600).auto("format").url();
					setProjects((projects) => [...projects, project]);
				} catch (error) {
					console.log(error);
				}
			}
			if (record.transition === "disappear") {
				setProjects((projects) => projects.filter((t) => t._id !== record.documentId));
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	return project;
}
