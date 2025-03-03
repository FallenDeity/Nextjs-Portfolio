"use client";

import { ChevronDown, LucideIcon } from "lucide-react";
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

export interface Experience {
	id: string;
	company: string;
	role: string;
	duration: string;
	description: string;
	points?: string[];
	icon?: LucideIcon | string;
	subExperiences?: Experience[];
}

export function ExperienceList({
	experiences,
	depth,
}: {
	experiences: Experience[];
	depth: number;
}): React.ReactElement {
	return (
		<Timeline orientation="vertical">
			{experiences.map((experience) => (
				<TimelineItem key={experience.id}>
					<TimelineSeparator>
						<TimelineDot className="h-10 w-10 lg:h-7 lg:w-7">
							{typeof experience.icon === "string" ? (
								<Image
									width={40}
									height={40}
									src={experience.icon}
									alt="icon"
									className="h-10 w-10 object-contain lg:h-7 lg:w-7"
								/>
							) : (
								experience.icon && <experience.icon />
							)}
						</TimelineDot>
						<TimelineConnector />
					</TimelineSeparator>
					<TimelineContent>
						<ExperienceCard experience={experience} depth={depth} />
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
}

function ExperienceCard({ experience, depth }: { experience: Experience; depth: number }): React.ReactElement {
	const [open, setOpen] = React.useState<boolean>(depth === 1);
	return (
		<Collapsible open={open}>
			<CollapsibleTrigger className="w-full" onClick={() => setOpen(!open)}>
				<div className={`flex w-full flex-row items-center justify-between ${!open && depth == 1 && "pb-4"}`}>
					<div className="flex flex-col items-start justify-start">
						<TimelineTitle className="text-md text-start font-semibold">{experience.role}</TimelineTitle>
						<TimelineDescription className="text-muted-foreground text-start text-xs">
							{experience.company} | {experience.duration}
						</TimelineDescription>
						<TimelineDescription className="text-muted-foreground text-start text-xs">
							{experience.description}
						</TimelineDescription>
					</div>
					<div className="flex items-center">
						{(experience.points || experience.subExperiences) && (
							<div className="flex cursor-pointer items-center">
								<div
									className={`transform transition-transform duration-300 ${
										open ? "rotate-180" : "rotate-0"
									}`}>
									<ChevronDown className="h-4 w-4" />
								</div>
							</div>
						)}
					</div>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				{experience.points && (
					<ul className="mt-2 list-inside list-disc">
						{experience.points.map((point) => (
							<li key={point} className="text-foreground/70 text-[13px] tracking-tighter text-pretty">
								{point}
							</li>
						))}
					</ul>
				)}
				{experience.subExperiences && (
					<Timeline className="mt-4" orientation="vertical">
						<ExperienceList experiences={experience.subExperiences} depth={depth + 1} />
					</Timeline>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
}
