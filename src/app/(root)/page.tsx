import * as React from "react";

import { ExperienceTimeline } from "@/components/home/experience-card";
import { StatusCard } from "@/components/home/github-card";
import ProfileCard from "@/components/home/profile-card";
import { ProjectCard } from "@/components/home/project-card-carousel";
import { TechnologyCard } from "@/components/home/technology-card";
import { BentoGrid } from "@/components/magicui/bento-grid";

export default function BentoDemo(): React.ReactElement {
	return (
		<div className="flex h-full w-full flex-col items-center justify-start space-y-6 px-6 pt-6 pb-30">
			<BentoGrid className="lg:grid-rows-3">
				<ProfileCard />
				<ExperienceTimeline />
				<ProjectCard />
				<TechnologyCard />
				<StatusCard />
			</BentoGrid>
		</div>
	);
}
