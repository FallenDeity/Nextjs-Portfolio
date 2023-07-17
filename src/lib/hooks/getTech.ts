"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface Tech {
	name: string;
	logo: string;
	description: string;
}

export default function useTech(): Tech[] {
	const [tech, setTech] = React.useState<Tech[]>([]);
	React.useEffect(() => {
		async function getTech(): Promise<void> {
			const techs = await sanityClient.fetch<Tech[]>('*[_type == "tech"]');
			techs.forEach((tech) => {
				tech.logo = urlFor(tech.logo).url();
			});
			setTech(techs);
		}
		void getTech();
	}, []);
	return tech;
}
