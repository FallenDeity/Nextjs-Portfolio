// import dynamic from "next/dynamic";
import { getFileAsset } from "@sanity/asset-utils";
import React from "react";

import { ExperienceTimeline } from "@/components/home/experience-card";
import { StatusCard } from "@/components/home/github-card";
import { ProfileCard } from "@/components/home/profile-card";
import { ProjectCard } from "@/components/home/project-card-carousel";
import { TechnologyCard } from "@/components/home/technology-card";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { dataset, projectId } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PROFILE_QUERY } from "@/sanity/lib/queries";

const profile = await sanityFetch({
	query: PROFILE_QUERY,
	tags: ["profile", "education", "experience", "project"],
});

export default function HomePage(): React.ReactElement {
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
				<StatusCard github_username={(profile?.contact.github ?? "").split("/").pop() ?? ""} />
			</BentoGrid>
		</div>
	);
}
