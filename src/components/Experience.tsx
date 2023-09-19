"use client";

import "react-vertical-timeline-component/style.min.css";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { BsPlusLg } from "react-icons/bs";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";

import useExperience from "@/lib/hooks/getExperience";
import { Experience as ExprienceModel } from "@/lib/models";
import { textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./wrappers/SectionWrapper";

const ExperienceCard = ({ experience }: { experience: ExprienceModel }): React.JSX.Element => {
	return (
		<VerticalTimelineElement
			className="vertical-timeline-element--work"
			contentStyle={{
				background: "linear-gradient(to bottom right, #2c0a4f, #1d1836)",
				color: "#fff",
			}}
			contentArrowStyle={{ borderRight: "7px solid  #232631" }}
			date={experience.date}
			iconStyle={{ background: experience.iconBg }}
			icon={
				<div className="flex h-full w-full items-center justify-center p-1.5">
					<Image
						width={64}
						height={64}
						src={experience.icon}
						alt={experience.company_name}
						className="h-full w-full object-contain"
					/>
				</div>
			}>
			<div>
				<h3 className="vertical-timeline-element-title text-white text-[24px] font-bold">{experience.title}</h3>
				<p
					className="vertical-timeline-element-subtitle text-[16px] font-semibold text-neutral-300"
					style={{ margin: 0 }}>
					{experience.company_name}
				</p>
			</div>
			<ul className="ml-2 mt-5 list-disc space-y-2 sm:ml-5">
				{experience.points.map((point, index) => (
					<li
						key={`experience-point-${index}`}
						className="pl-1 text-[13px] tracking-wider text-white-100 sm:text-[14px]">
						{point}
					</li>
				))}
			</ul>
		</VerticalTimelineElement>
	);
};

const Experience = (): React.JSX.Element => {
	const experiences = useExperience();
	const [cards, setCards] = React.useState<number>(2);
	React.useEffect(() => {
		const hidden = document.querySelectorAll(".is-hidden");
		const ob = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.remove("is-hidden");
					entry.target.classList.add("bounce-in");
					ob.unobserve(entry.target);
				}
			});
		});
		hidden.forEach((item) => {
			ob.observe(item);
		});
	}, [cards, experiences]);
	return (
		<>
			<motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
				<p className={`${styles.sectionSubText} text-center`}>What I have done so far</p>
				<h2 className={`${styles.sectionHeadText} text-center`}>Work Experience</h2>
			</motion.div>
			{experiences.length > 0 && (
				<div className="mt-20 flex flex-col">
					<VerticalTimeline className="h-full w-full">
						{experiences.slice(0, cards).map((experience, index) => (
							<ExperienceCard key={`experience-${index}`} experience={experience} />
						))}
						{cards < experiences.length && (
							<VerticalTimelineElement
								className="vertical-timeline-element--work cursor-pointer"
								iconStyle={{ background: "#11ABB0", color: "#fff" }}
								icon={<BsPlusLg className="transition-all duration-300 ease-in-out hover:scale-150" />}
								iconOnClick={(): void => setCards(Math.min(cards + 2, experiences.length))}
							/>
						)}
					</VerticalTimeline>
				</div>
			)}
		</>
	);
};

export default StarWrapper(Experience, "work");
