/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

// @ts-expect-error unused variable
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

const ExperienceItem: React.FC<{ experience: Experience; level: number }> = ({ experience, level }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<CollapsibleTrigger className="flex items-center space-x-2">
				{experience.subExperiences && (
					<div className="flex items-center">
						{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
					</div>
				)}
				<div className="flex flex-col">
					<h3 className="text-md font-semibold">{experience.company}</h3>
					<p className="text-sm text-neutral-500">{experience.role}</p>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<p className="text-xs text-neutral-500">{experience.duration}</p>
				<p className="text-sm tracking-tight">{experience.description}</p>
				{experience.subExperiences && (
					<div className="space-y-2 pl-4">
						{experience.subExperiences.map((exp) => (
							<ExperienceItem key={exp.id} experience={exp} level={level + 1} />
						))}
					</div>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
};

export const ExperienceCard: React.FC = () => {
	return (
		<BentoCard name="Experience" className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3">
			<div className="flex h-full flex-col items-start p-6">
				<h2 className="mb-4 text-xl font-semibold">Experience</h2>
			</div>
		</BentoCard>
	);
};
