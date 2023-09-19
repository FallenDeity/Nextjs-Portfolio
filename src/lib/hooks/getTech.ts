"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface Tech {
	_id: string;
	name: string;
	logo: string;
	description: string;
	_createdAt: string;
}

export default function useTech(): Tech[] {
	const [tech, setTech] = React.useState<Tech[]>([]);
	React.useEffect(() => {
		async function fetchTech(): Promise<void> {
			const query = '*[_type == "tech"]';
			const tech = await sanityClient.fetch<Tech[]>(query);
			tech.forEach((tech) => {
				tech.logo = urlFor(tech.logo).width(100).auto("format").url();
			});
			setTech(tech);
		}
		void fetchTech();
		const subscription = sanityClient.listen("*[_type == 'tech']").subscribe((record) => {
			if (record.transition === "appear") {
				try {
					const tech = record.result as unknown as Tech;
					tech.logo = urlFor(tech.logo).width(100).auto("format").url();
					setTech((techs) => [...techs, tech]);
				} catch (error) {
					console.log(error);
				}
			}
			if (record.transition === "disappear") {
				setTech((techs) => techs.filter((t) => t._id !== record.documentId));
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	return tech;
}
