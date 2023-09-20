"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface Experience {
	_id: string;
	title: string;
	company_name: string;
	icon: string;
	iconBg: string;
	date: string;
	points: string[];
	_createdAt: string;
}

export default function useExperience(): Experience[] {
	const [experience, setExperience] = React.useState<Experience[]>([]);
	React.useEffect(() => {
		async function fetchExperience(): Promise<void> {
			const query = '*[_type == "experience"] | order(_createdAt asc)';
			const experience = await sanityClient.fetch<Experience[]>(query);
			experience.forEach((experience) => {
				experience.icon = urlFor(experience.icon).width(75).auto("format").url();
			});
			setExperience(experience);
		}
		void fetchExperience();
		const subscription = sanityClient.listen("*[_type == 'experience']").subscribe((record) => {
			if (record.transition === "appear") {
				try {
					const experience = record.result as unknown as Experience;
					experience.icon = urlFor(experience.icon).width(75).auto("format").url();
					setExperience((experiences) => [...experiences, experience]);
				} catch (error) {
					console.log(error);
				}
			}
			if (record.transition === "disappear") {
				setExperience((experiences) => experiences.filter((t) => t._id !== record.documentId));
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	return experience;
}
