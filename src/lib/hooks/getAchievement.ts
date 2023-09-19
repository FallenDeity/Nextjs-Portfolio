"use client";

import React from "react";

import { sanityClient, urlFor } from "../sanity.client";

export interface Achievement {
	_id: string;
	name: string;
	image: string;
	description?: string;
	link: string;
	_createdAt: string;
}

export default function useAchievement(): Achievement[] {
	const [achievement, setAchievement] = React.useState<Achievement[]>([]);
	React.useEffect(() => {
		async function fetchAchievement(): Promise<void> {
			const query = '*[_type == "achievement"]';
			const achievement = await sanityClient.fetch<Achievement[]>(query);
			achievement.forEach((achievement) => {
				achievement.image = urlFor(achievement.image).auto("format").url();
			});
			setAchievement(achievement);
		}
		void fetchAchievement();
		const subscription = sanityClient.listen("*[_type == 'achievement']").subscribe((record) => {
			if (record.transition === "appear") {
				try {
					const achievement = record.result as unknown as Achievement;
					achievement.image = urlFor(achievement.image).auto("format").url();
					setAchievement((achievements) => [...achievements, achievement]);
				} catch (error) {
					console.log(error);
				}
			}
			if (record.transition === "disappear") {
				setAchievement((achievements) => achievements.filter((t) => t._id !== record.documentId));
			}
		});
		return () => subscription.unsubscribe();
	}, []);
	return achievement;
}
