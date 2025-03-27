import { getFileAsset } from "@sanity/asset-utils";
import dynamic from "next/dynamic";
import React from "react";

import { BentoGrid } from "@/components/magicui/bento-grid";
import { dataset, projectId } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PROFILE_QUERY } from "@/sanity/lib/queries";

const ExperienceTimeline = dynamic(() =>
	import("@/components/home/experience-card").then((mod) => mod.ExperienceTimeline)
);
const StatusCard = dynamic(() => import("@/components/home/github-card").then((mod) => mod.StatusCard));
const ProfileCard = dynamic(() => import("@/components/home/profile-card").then((mod) => mod.ProfileCard));
const ProjectCard = dynamic(() => import("@/components/home/project-card-carousel").then((mod) => mod.ProjectCard));
const TechnologyCard = dynamic(() => import("@/components/home/technology-card").then((mod) => mod.TechnologyCard));

export default async function HomePage(): Promise<React.ReactElement> {
	const profile = await sanityFetch({
		query: PROFILE_QUERY,
		tags: ["profile", "education", "experience", "project"],
	});
	return (
		<div className="flex h-full w-full flex-col items-center justify-start space-y-6 px-2 pt-2 pb-44 md:px-6 md:pt-6 md:pb-36">
			<BentoGrid className="lg:grid-rows-3">
				<ProfileCard
					name={profile?.name ?? ""}
					caption={profile?.caption ?? ""}
					bio={profile?.bio ?? ""}
					resume={
						profile?.resume?.asset?._ref
							? getFileAsset(profile.resume.asset, { dataset, projectId }).url
							: ""
					}
					languages={profile?.languages ?? []}
					image={profile?.image ? urlFor(profile.image).width(120).height(120).url() : ""}
					updateAt={profile?._updatedAt ? new Date(profile._updatedAt) : new Date()}
					mailto={profile?.contact?.email ?? ""}
				/>
				<ExperienceTimeline experiences={profile?.experience ?? []} />
				<ProjectCard projects={profile?.projects ?? []} />
				<TechnologyCard technologies={profile?.technologies ?? []} educations={profile?.education ?? []} />
				<StatusCard />
			</BentoGrid>
		</div>
	);
}
