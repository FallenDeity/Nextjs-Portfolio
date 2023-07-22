"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Tilt from "react-parallax-tilt";

import useAbout from "@/lib/hooks/getAbout";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./wrappers/SectionWrapper";

const ServiceCard = ({
	index,
	name,
	logo,
	description,
}: {
	index: number;
	name: string;
	logo: string;
	description: string;
}): React.JSX.Element => (
	<Tilt className="w-full xs:w-[250px]" scale={1.05} tiltMaxAngleX={30} tiltMaxAngleY={30} transitionSpeed={2500}>
		<motion.div
			initial="hidden"
			whileInView="show"
			viewport={{ once: true }}
			variants={fadeIn("right", "spring", index * 0.5, 0.75)}
			className="purple-gradient w-full rounded-lg p-[1px] shadow-[0_35px_120px_-15px_#211e35]">
			<div className="flex min-h-[350px] flex-col rounded-md bg-[#151030]">
				<Image
					src={logo}
					alt="web-development"
					className="w-full rounded-t-lg object-contain"
					width={64}
					height={64}
				/>
				<h2 className="text-white mt-4 text-center text-xl font-bold">{name}</h2>
				<p className="px-4 py-4 text-left text-xs leading-5 text-neutral-300">{description}</p>
			</div>
		</motion.div>
	</Tilt>
);

export function About(): React.JSX.Element {
	const abouts = useAbout();
	return (
		<>
			<motion.div variants={textVariant(undefined)} initial="hidden" whileInView="show" viewport={{ once: true }}>
				<p className={styles.sectionSubText}>Introduction</p>
				<h2 className={styles.sectionHeadText}>Overview</h2>
			</motion.div>
			<motion.p
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				variants={fadeIn("", "", 0.1, 1)}
				className="mt-4 max-w-3xl text-[17px] leading-[30px] text-neutral-400">
				Hey there! I'm Triyan, a student and an aspiring software developer from India. I have expertise with
				languages such as TypeScript, Python, and C++, I enjoy exploring frameworks like Next.js, FastAPI, React
				Native, Docker etc. My passion lies in creating efficient and user-friendly solutions that solve
				real-world problems. I'm eager to bring innovative ideas to life through code, and I'm always excited to
				take on projects!
			</motion.p>
			<div className="mt-20 flex flex-wrap items-center justify-center gap-10">
				{abouts.map((service, index) => (
					<ServiceCard key={service.name} index={index} {...service} />
				))}
			</div>
		</>
	);
}

export default StarWrapper(About, "about");
