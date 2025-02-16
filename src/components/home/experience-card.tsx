"use client";

import { ChevronDown, Code, LucideIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";
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

interface Experience {
	id: string;
	company: string;
	role: string;
	duration: string;
	description: string;
	points?: string[];
	icon?: LucideIcon | string;
	subExperiences?: Experience[];
}

const experiences: Experience[] = [
	{
		id: "1",
		company: "Tech Innovations Inc.",
		role: "Senior Software Engineer",
		duration: "Jan 2020 - Present",
		icon: "https://cdn.sanity.io/images/obr3wr6r/production/fbcc49c466c82b3aa628373f5cb9c79e0dfdd428-926x899.png?w=75&auto=format",
		description: "Leading development of cutting-edge web applications.",
		points: [
			"Developed a new feature that increased user engagement by 30%.",
			"Mentored junior developers to improve code quality and productivity.",
			"Collaborated with the design team to create a new user interface for our flagship product.",
		],
		subExperiences: [
			{
				id: "1-1",
				company: "Project Alpha",
				role: "Tech Lead",
				duration: "Jun 2021 - Present",
				description: "Spearheading the development of our flagship product.",
				icon: Code,
				points: [
					"Implemented a new CI/CD pipeline that reduced deployment time by 50%.",
					"Led a team of 5 developers to deliver a major release ahead of schedule.",
					"Worked closely with the product team to define the roadmap for the next quarter.",
				],
			},
			{
				id: "1-2",
				company: "Project Beta",
				role: "Senior Developer",
				duration: "Jan 2020 - May 2021",
				description: "Developed and launched a successful MVP.",
				icon: "https://cdn.sanity.io/images/obr3wr6r/production/87f536b7e1adb65d7a7eb8558e701162a3e071e7-240x240.png?w=100&auto=format",
				points: [
					"Built a scalable backend architecture that supported rapid growth.",
					"Collaborated with the marketing team to create a successful go-to-market strategy.",
					"Optimized the frontend performance to improve user experience.",
				],
			},
		],
	},
	{
		id: "2",
		company: "StartUp Ventures",
		role: "Full Stack Developer",
		duration: "Mar 2018 - Dec 2019",
		description: "Wore multiple hats in a fast-paced startup environment.",
		icon: "https://cdn.sanity.io/images/obr3wr6r/production/7b90e6dda3e1207016874d2a78a0327900b531a4-1024x1024.png?w=75&auto=format",
		points: [
			"Developed a new feature that increased user engagement by 30%.",
			"Mentored junior developers to improve code quality and productivity.",
			"Collaborated with the design team to create a new user interface for our flagship product.",
		],
	},
];

function ExperienceList({ experiences, depth }: { experiences: Experience[]; depth: number }): React.ReactElement {
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
	const [open, setOpen] = React.useState<boolean>(false);
	return (
		<Collapsible>
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

export function ExperienceTimeline(): React.ReactElement {
	return (
		<BentoCard name="Experience" className="pb-6 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3">
			<div className="flex h-full w-full flex-col items-start lg:col-span-1">
				<h2 className="my-6 px-6 text-xl font-semibold">Experience</h2>
				<div className="scrollbar-hide mx-6 h-[50vh] w-[calc(100%-3rem)] overflow-y-auto">
					<ExperienceList experiences={experiences} depth={1} />
				</div>
			</div>
		</BentoCard>
	);
}
