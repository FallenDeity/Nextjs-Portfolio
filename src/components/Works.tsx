"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { AiFillGithub } from "react-icons/ai";
import Tilt from "react-parallax-tilt";

import { Project, projects } from "@/lib/constants";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./SectionWrapper";

const ProjectCard = ({ project, index }: { project: Project; index: number }): React.JSX.Element => {
	const router = useRouter();
	return (
		<motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
			<Tilt
				tiltReverse={true}
				tiltMaxAngleX={20}
				tiltMaxAngleY={20}
				tiltEnable={true}
				className="pink-gradient w-full rounded-2xl p-[1px] shadow-[0_35px_120px_-15px_#211e35]">
				<div className="rounded-2xl bg-[#151030] p-5 sm:w-[360px]">
					<div className="relative h-[230px] w-full">
						<Image
							src={project.image}
							alt="project_image"
							className="h-full w-full rounded-2xl object-cover"
							width={360}
							height={230}
						/>
						<div className="card-img_hover absolute inset-0 m-3 flex justify-end">
							<div
								onClick={(): void => router.push(project.source_code_link)}
								className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
								<AiFillGithub className="h-1/2 w-1/2 text-[20px] text-white" />
							</div>
						</div>
					</div>
					<div className="mt-5">
						<h3 className="text-[24px] font-bold text-white">{project.name}</h3>
						<p className="mt-2 text-[14px] text-neutral-300">{project.description}</p>
					</div>
					<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
						{project.tags.map((tag) => (
							<p key={`${project.name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>
								#{tag.name}
							</p>
						))}
					</div>
				</div>
			</Tilt>
		</motion.div>
	);
};

const Works = (): React.JSX.Element => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={`${styles.sectionSubText} `}>My work</p>
				<h2 className={`${styles.sectionHeadText}`}>Projects</h2>
			</motion.div>
			<div className="flex w-full">
				<motion.p
					variants={fadeIn("", "", 0.1, 1)}
					className="mt-3 max-w-3xl text-[17px] leading-[30px] text-neutral-300">
					Following projects showcases my skills and experience through real-world examples of my work. Each
					project is briefly described with links to code repositories and live demos in it. It reflects my
					ability to solve complex problems, work with different technologies, and manage projects
					effectively.
				</motion.p>
			</div>

			<div className="mt-20 flex flex-wrap gap-7">
				{projects.map((project, index) => (
					<ProjectCard key={`project-${index}`} index={index} project={project} />
				))}
			</div>
		</>
	);
};

export default StarWrapper(Works, "Works");
