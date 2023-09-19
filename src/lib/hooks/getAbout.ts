"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface About {
	_id: string;
	name: string;
	logo: string;
	description: string;
	_createdAt: string;
}

export default function useAbout(): About[] {
	const [about, setAbout] = React.useState<About[]>([]);
	React.useEffect(() => {
		async function fetchAbout(): Promise<void> {
			const query = '*[_type == "about"]';
			const about = await sanityClient.fetch<About[]>(query);
			about.forEach((about) => {
				about.logo = urlFor(about.logo).width(400).auto("format").url();
			});
			setAbout(about);
		}
		void fetchAbout();
		const subscription = sanityClient.listen("*[_type == 'about']").subscribe((record) => {
			if (record.transition === "appear") {
				try {
					const about = record.result as unknown as About;
					about.logo = urlFor(about.logo).width(400).auto("format").url();
					setAbout((abouts) => [...abouts, about]);
				} catch (error) {
					console.log(error);
				}
			}
			if (record.transition === "disappear") {
				setAbout((abouts) => abouts.filter((t) => t._id !== record.documentId));
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	return about;
}
