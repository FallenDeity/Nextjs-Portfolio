import Image from "next/image";
import React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineDescription,
	TimelineDot,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
} from "@/components/ui/timeline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CUSTOM_LOGOS, formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PROFILE_QUERYResult } from "@/sanity/sanity.types";

interface TechnologyCardProps {
	technologies: string[];
	educations: NonNullable<PROFILE_QUERYResult>["education"];
}

function EducationList({
	educations,
}: {
	educations: NonNullable<PROFILE_QUERYResult>["education"];
}): React.ReactElement {
	return (
		<Timeline orientation="vertical">
			{educations.map((education) => (
				<TimelineItem key={education.institution}>
					<TimelineSeparator>
						<TimelineDot className="h-10 w-10 lg:h-7 lg:w-7">
							<Image
								width={40}
								height={40}
								src={urlFor(education.icon).url() ?? ""}
								alt="icon"
								className="h-10 w-10 object-contain lg:h-7 lg:w-7"
							/>
						</TimelineDot>
						<TimelineConnector />
					</TimelineSeparator>
					<TimelineContent>
						<div className="flex w-full flex-row items-center justify-between pb-2">
							<div className="flex flex-col items-start justify-start">
								<TimelineTitle className="text-md text-start font-semibold">
									{education.degree}
								</TimelineTitle>
								<TimelineDescription className="text-muted-foreground text-start text-xs">
									{education.institution}
									<span className="text-muted-foreground/40 mx-2">&bull;</span>
									<span className="text-muted-foreground/70">
										{formatDate(education.startDate)} -{" "}
										{education.startDate === education.endDate
											? "Present"
											: formatDate(education.endDate ?? new Date().toISOString())}
									</span>
								</TimelineDescription>
								<TimelineDescription className="text-muted-foreground text-start text-xs">
									{education.description}
								</TimelineDescription>
							</div>
						</div>
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
}

export function TechnologyCard({ technologies, educations }: TechnologyCardProps): React.ReactElement {
	const slugs = technologies.map((tech) => tech.toLowerCase());
	const firstRow = slugs.slice(0, slugs.length / 2);
	const secondRow = slugs.slice(slugs.length / 2);
	return (
		<BentoCard name="Technology" className="lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4">
			<div className="flex w-full flex-col">
				<div className="flex w-full flex-col items-start">
					<h2 className="my-6 px-6 text-xl font-semibold">Education</h2>
					<div className="mx-6 flex w-[calc(100%-3rem)] flex-col">
						<EducationList educations={educations.sort((a, b) => b.startDate.localeCompare(a.startDate))} />
					</div>
				</div>
				<div className="flex w-full flex-col items-start pb-6">
					<h2 className="my-6 px-6 text-xl font-semibold">Technologies</h2>
					<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
						<Marquee pauseOnHover className="[--duration:20s]">
							{firstRow.map((slug) => (
								<TooltipProvider key={slug}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Image
												className="bg-accent/60 mx-4 rounded-lg border p-3"
												key={slug}
												src={
													CUSTOM_LOGOS.includes(slug)
														? `/${slug}.svg`
														: `https://cdn.simpleicons.org/${slug}`
												}
												alt={slug}
												width={64}
												height={64}
											/>
										</TooltipTrigger>
										<TooltipContent className="pb-2 text-xs capitalize">{slug}</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							))}
						</Marquee>
						<Marquee pauseOnHover reverse className="[--duration:20s]">
							{secondRow.map((slug) => (
								<TooltipProvider key={slug}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Image
												className="bg-accent/60 mx-4 rounded-lg border p-3"
												key={slug}
												src={
													CUSTOM_LOGOS.includes(slug)
														? `/${slug}.svg`
														: `https://cdn.simpleicons.org/${slug}`
												}
												alt={slug}
												width={64}
												height={64}
											/>
										</TooltipTrigger>
										<TooltipContent className="pb-2 text-xs capitalize">{slug}</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							))}
						</Marquee>
					</div>
				</div>
			</div>
		</BentoCard>
	);
}
