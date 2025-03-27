"use client";

import { getImageDimensions } from "@sanity/asset-utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PROFILE_QUERYResult } from "@/sanity/sanity.types";

import { BentoCard } from "../magicui/bento-grid";

type Experience = NonNullable<PROFILE_QUERYResult>["experience"][number];

interface ExperienceTimelineProps {
	experiences: Experience[];
}

const ExperienceCard: React.FC<Experience> = ({ ...experience }) => {
	const [open, setOpen] = React.useState<boolean>(false);
	return (
		<Collapsible open={open}>
			<CollapsibleTrigger className="w-full">
				<div className="flex w-full flex-row items-center justify-between">
					<div className="flex flex-col items-start justify-start">
						<TimelineTitle className="text-md font-semibold">{experience.role}</TimelineTitle>
						<TimelineDescription className="text-muted-foreground text-xs">
							{experience.company}
							<span className="text-muted-foreground/40 mx-2">&bull;</span>
							<span className="text-muted-foreground/70">
								{formatDate(experience.startDate)} -{" "}
								{experience.startDate === experience.endDate
									? "Present"
									: formatDate(experience.endDate ?? new Date().toISOString())}
							</span>
						</TimelineDescription>
						<TimelineDescription className="text-muted-foreground pb-2 text-start text-xs">
							{experience.description}
						</TimelineDescription>
					</div>
					<div className="flex items-center">
						{(experience.points || experience.subExperiences) && (
							<div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center">
								{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
							</div>
						)}
					</div>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				{experience.points && (
					<ul className="mt-2 list-inside list-disc">
						{experience.points.map((point) => (
							<li key={point} className="text-foreground/70 text-xs text-pretty lg:text-[13px]">
								{point}
							</li>
						))}
					</ul>
				)}
				{experience.subExperiences && (
					<Timeline className="mt-4" orientation="vertical">
						<ExperienceList experiences={experience.subExperiences as Experience[]} />
					</Timeline>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
};

const ExperienceList: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
	return (
		<Timeline orientation="vertical">
			{experiences.map((experience) => (
				<TimelineItem key={experience._id}>
					<TimelineSeparator>
						<TimelineDot>
							{experience.icon && (
								<Image
									className="rounded-full"
									src={urlFor(experience.icon).url() ?? ""}
									alt={"icon"}
									width={getImageDimensions(experience.icon.asset?._ref ?? "").width}
									height={getImageDimensions(experience.icon.asset?._ref ?? "").height}
								/>
							)}
						</TimelineDot>
						<TimelineConnector />
					</TimelineSeparator>
					<TimelineContent>
						<ExperienceCard {...experience} />
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
};

// timeline with collapsible points for each experience and sub-experience
// sub-experiences are rendered as nested timelines
export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
	return (
		<BentoCard name="Experience" className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3">
			<div className="flex h-full w-full flex-col items-start lg:col-span-1">
				<div className="my-4 flex items-center justify-center gap-2 px-6">
					<h2 className="text-xl font-semibold">Experience</h2>
				</div>
				<div className="scrollbar-hide mx-6 h-[55vh] w-[calc(100%-3rem)] overflow-y-auto">
					<ExperienceList experiences={experiences.sort((a, b) => b.startDate.localeCompare(a.startDate))} />
				</div>
			</div>
		</BentoCard>
	);
};
