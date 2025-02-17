"use client";

import * as React from "react";

import { ExperienceTimeline } from "@/components/home/experience-card";
import ProfileCard from "@/components/home/profile-card";
import { ProjectCard } from "@/components/home/project-card-carousel";
import { TechnologyCard } from "@/components/home/technology-card";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

interface Feature {
	name: string;
	className: string;
}

const features: Feature[] = [
	{
		name: "Multilingual",
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
	},
];

export default function BentoDemo(): React.ReactElement {
	return (
		<div className="flex h-full w-full flex-col items-center justify-start space-y-6 px-6 pt-6 pb-30">
			<BentoGrid className="lg:grid-rows-3">
				<ProfileCard />
				<ExperienceTimeline />
				<ProjectCard />
				<TechnologyCard />
				{features.map((feature) => (
					<BentoCard key={feature.name} {...feature} />
				))}
			</BentoGrid>
		</div>
	);
}
