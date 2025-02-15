/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChevronDown, ChevronUp, Code } from "lucide-react";
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

import { BentoCard } from "../magicui/bento-grid";

interface Experience {
	id: string;
	company: string;
	role: string;
	duration: string;
	description: string;
	points?: string[];
	icon?: string;
	subExperiences?: Experience[];
}

const experiences: Experience[] = [
	{
		id: "1",
		company: "Tech Innovations Inc.",
		role: "Senior Software Engineer",
		duration: "Jan 2020 - Present",
		icon: "code",
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
		icon: "code",
		points: [
			"Developed a new feature that increased user engagement by 30%.",
			"Mentored junior developers to improve code quality and productivity.",
			"Collaborated with the design team to create a new user interface for our flagship product.",
		],
	},
];

const ExperienceList: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
	const [open, setOpen] = React.useState<boolean>(false);
	return (
		<Timeline orientation="vertical">
			{experiences.map((experience) => (
				<TimelineItem key={experience.id}>
					<TimelineSeparator>
						<TimelineDot>
							<Code />
						</TimelineDot>
						<TimelineConnector />
					</TimelineSeparator>
					<TimelineContent>
						<Collapsible>
							<CollapsibleTrigger className="w-full">
								<div className="flex w-full flex-row items-center justify-between">
									<div className="flex flex-col items-start justify-start">
										<TimelineTitle className="text-md font-semibold">
											{experience.role}
										</TimelineTitle>
										<TimelineDescription className="text-muted-foreground text-xs">
											{experience.company} | {experience.duration}
										</TimelineDescription>
										<TimelineDescription className="text-muted-foreground text-xs">
											{experience.description}
										</TimelineDescription>
									</div>
									<div className="flex items-center">
										{experience.points && (
											<div
												className="flex cursor-pointer items-center"
												onClick={() => setOpen(!open)}>
												{open ? <ChevronUp /> : <ChevronDown />}
											</div>
										)}
									</div>
								</div>
							</CollapsibleTrigger>
							<CollapsibleContent>
								{experience.points && (
									<ul className="mt-2 list-inside list-disc">
										{experience.points.map((point) => (
											<li key={point} className="text-sm tracking-tight">
												{point}
											</li>
										))}
									</ul>
								)}
							</CollapsibleContent>
						</Collapsible>
						{experience.subExperiences && (
							<Timeline className="mt-4" orientation="horizontal">
								<ExperienceList experiences={experience.subExperiences} />
							</Timeline>
						)}
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
};

// timeline with collapsible points for each experience and sub-experience
// sub-experiences are rendered as nested timelines
export const ExperienceTimeline: React.FC = () => {
	return (
		<BentoCard name="Experience" className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3">
			<div className="flex h-full flex-col items-start">
				<h2 className="mb-4 p-6 text-xl font-semibold">Experience</h2>
				<div className="mx-6 h-[50vh] w-full overflow-y-auto">
					<ExperienceList experiences={experiences} />
				</div>
			</div>
		</BentoCard>
	);
};
