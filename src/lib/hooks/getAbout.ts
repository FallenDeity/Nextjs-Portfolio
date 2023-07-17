"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface About {
	name: string;
	logo: string;
	description: string;
}

export default function useAbout(): About[] {
	const [about, setAbout] = React.useState<About[]>([]);
	React.useEffect(() => {
		async function getAbout(): Promise<void> {
			const about = await sanityClient.fetch<About[]>('*[_type == "about"]');
			about.forEach((about) => {
				about.logo = urlFor(about.logo).url();
			});
			setAbout(about);
		}
		void getAbout();
	}, []);
	return about;
}
