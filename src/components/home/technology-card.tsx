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

const slugs = [
	"typescript",
	"javascript",
	"dart",
	"rust",
	"react",
	"flutter",
	"android",
	"html5",
	"css3",
	"nodedotjs",
	"express",
	"nextdotjs",
	"prisma",
	"amazonwebservices",
	"postgresql",
	"firebase",
	"nginx",
	"vercel",
	"testinglibrary",
	"jest",
	"cypress",
	"docker",
	"git",
	"jira",
	"github",
	"gitlab",
	"jetbrains",
	"androidstudio",
	"sonarqube",
	"figma",
];

interface Education {
	id: string;
	institution: string;
	degree: string;
	duration: string;
	description: string;
	icon: string;
}

const educations: Education[] = [
	{
		id: "1",
		institution: "University of Technology",
		degree: "Bachelor of Science in Computer Science",
		duration: "2014 - 2018",
		icon: "https://cdn.simpleicons.org/accenture",
		description: "Graduated with honors and a passion for software development.",
	},
	{
		id: "2",
		institution: "High School of Technology",
		degree: "High School Diploma",
		duration: "2010 - 2014",
		icon: "https://cdn.simpleicons.org/4chan",
		description: "Graduated with honors and a passion for technology.",
	},
];

function EducationList({ educations }: { educations: Education[] }): React.ReactElement {
	return (
		<Timeline orientation="vertical">
			{educations.map((education) => (
				<TimelineItem key={education.id}>
					<TimelineSeparator>
						<TimelineDot className="h-10 w-10 lg:h-7 lg:w-7">
							<Image
								width={40}
								height={40}
								src={education.icon}
								alt="icon"
								className="h-10 w-10 object-contain lg:h-7 lg:w-7"
							/>
						</TimelineDot>
						<TimelineConnector />
					</TimelineSeparator>
					<TimelineContent>
						<div className="flex w-full flex-row items-center justify-between pb-4">
							<div className="flex flex-col items-start justify-start">
								<TimelineTitle className="text-md text-start font-semibold">
									{education.degree}
								</TimelineTitle>
								<TimelineDescription className="text-muted-foreground text-start text-xs">
									{education.institution} | {education.duration}
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

export function TechnologyCard(): React.ReactElement {
	const firstRow = slugs.slice(0, slugs.length / 2);
	const secondRow = slugs.slice(slugs.length / 2);
	return (
		<BentoCard name="Technology" className="lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4">
			<div className="flex w-full flex-col">
				<div className="flex w-full flex-col items-start">
					<h2 className="my-6 px-6 text-xl font-semibold">Education</h2>
					<div className="mx-6 flex w-full flex-col">
						<EducationList educations={educations} />
					</div>
				</div>
				<div className="flex w-full flex-col items-start">
					<h2 className="my-6 px-6 text-xl font-semibold">Technologies</h2>
					<Marquee className="[--duration:20s]">
						{firstRow.map((slug) => (
							<Image
								className="bg-accent/60 mx-4 rounded-lg p-3"
								key={slug}
								src={`https://cdn.simpleicons.org/${slug}`}
								alt={slug}
								width={64}
								height={64}
							/>
						))}
					</Marquee>
					<Marquee reverse className="[--duration:20s]">
						{secondRow.map((slug) => (
							<Image
								className="bg-accent/60 mx-4 rounded-lg p-3"
								key={slug}
								src={`https://cdn.simpleicons.org/${slug}`}
								alt={slug}
								width={64}
								height={64}
							/>
						))}
					</Marquee>
				</div>
			</div>
		</BentoCard>
	);
}
