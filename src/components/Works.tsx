"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AiFillGithub, AiOutlineLink } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Tilt from "react-parallax-tilt";

import useProject, { Project } from "@/lib/hooks/getProject";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./wrappers/SectionWrapper";

const ProjectCard = ({ project, index }: { project: Project; index: number }): React.JSX.Element => {
	const router = useRouter();
	return (
		<motion.div
			variants={fadeIn("up", "spring", index * 0.2, 0.65)}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true }}>
			<Tilt
				tiltReverse={true}
				tiltMaxAngleX={10}
				tiltMaxAngleY={10}
				tiltEnable={true}
				className="green-pink-gradient h-[475px] w-full rounded-2xl p-[1px] shadow-[0_35px_120px_-15px_#211e35]">
				<div className={`group h-full rounded-2xl bg-[#151030] p-4 sm:w-[360px]`}>
					<div className="flex h-full flex-col">
						<div className="w-full">
							<Image
								src={project.image}
								alt="project_image"
								className="h-[230px] w-full rounded-2xl object-cover"
								width={500}
								height={500}
							/>
							<div className="absolute inset-0 m-5 hidden justify-between group-hover:flex">
								{project.link && (
									<div
										onClick={(): void => router.push(String(project.link))}
										className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
										<AiOutlineLink className="text-white h-1/2 w-1/2 text-[20px]" />
									</div>
								)}
								{project.source_code_link && (
									<div
										onClick={(): void => router.push(String(project.source_code_link))}
										className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
										<AiFillGithub className="text-white h-1/2 w-1/2 text-[20px]" />
									</div>
								)}
							</div>
						</div>
						<div className="mt-5">
							<h3 className="text-white text-[24px] font-bold">{project.title}</h3>
							<p className="mt-2 text-pretty text-[13px] text-neutral-300">{project.description}</p>
						</div>
						<div className="mt-auto flex h-full flex-wrap items-end justify-center gap-2">
							{project.tags.map((tag) => (
								<p
									key={`${project.title}-${tag.tag}`}
									className={`text-[14px]`}
									style={{ color: tag.color }}>
									#{tag.tag}
								</p>
							))}
						</div>
					</div>
				</div>
			</Tilt>
		</motion.div>
	);
};

const Works = (): React.JSX.Element => {
	const router = useRouter();
	const projects = useProject();
	const pathname = usePathname();
	const [projectCards, setProjectCards] = React.useState<Project[]>([]);
	React.useEffect(() => {
		if (pathname.includes("/projects")) {
			setProjectCards(projects);
		} else {
			const randomProjects = projects.sort(() => Math.random() - Math.random()).slice(0, 3);
			setProjectCards(randomProjects);
		}
	}, [pathname, projects]);
	return (
		<>
			<motion.div
				variants={textVariant()}
				className="flex w-full flex-row justify-between"
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}>
				<div>
					<p className={`${styles.sectionSubText} `}>My work</p>
					<h2 className={`${styles.sectionHeadText}`}>Projects</h2>
				</div>
				{!pathname.includes("/projects") && (
					<button
						onClick={(): void => router.push("/projects")}
						className="text-white hidden h-fit flex-row items-center justify-center rounded-md px-5 py-2 font-bold transition-all duration-300 ease-in-out hover:bg-[#151030] sm:flex">
						VIEW MORE
						<BsArrowRight className="ml-2 text-[20px]" />
					</button>
				)}
			</motion.div>
			<div className="flex w-full">
				<motion.p
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					variants={fadeIn("", "", 0.1, 1)}
					className="mt-3 max-w-3xl text-[17px] leading-[30px] text-neutral-300">
					Following projects showcases my skills and experience through real-world examples of my work. Each
					project is briefly described with links to code repositories and live demos in it. It reflects my
					ability to solve complex problems, work with different technologies, and manage projects
					effectively.
				</motion.p>
			</div>
			<div className="mt-20 flex h-full w-full flex-wrap items-center justify-center gap-7">
				{projectCards.map((project, index) => (
					<ProjectCard key={`project-${index}`} index={index} project={project} />
				))}
			</div>
		</>
	);
};

export default StarWrapper(Works, "Works");
