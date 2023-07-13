"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Tilt from "react-parallax-tilt";

import { services } from "@/lib/constants";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./SectionWrapper";

const ServiceCard = ({ index, title, icon }: { index: number; title: string; icon: string }): React.JSX.Element => (
	<Tilt className="w-full xs:w-[250px]" scale={1.05} tiltMaxAngleX={30} tiltMaxAngleY={30} transitionSpeed={2500}>
		<motion.div
			variants={fadeIn("right", "spring", index * 0.5, 0.75)}
			className="green-pink-gradient w-full rounded-[20px] p-[1px] shadow-[0_35px_120px_-15px_#211e35]">
			<div className="flex min-h-[280px] flex-col items-center justify-evenly rounded-[20px] bg-[#151030] px-12 py-5">
				<Image src={icon} alt="web-development" className="h-16 w-16 object-contain" width={64} height={64} />

				<h3 className="text-center text-[20px] font-bold text-white">{title}</h3>
			</div>
		</motion.div>
	</Tilt>
);

export function About(): React.JSX.Element {
	return (
		<>
			<motion.div variants={textVariant(undefined)}>
				<p className={styles.sectionSubText}>Introduction</p>
				<h2 className={styles.sectionHeadText}>Overview</h2>
			</motion.div>
			<motion.p
				variants={fadeIn("", "", 0.1, 1)}
				className="mt-4 max-w-3xl text-[17px] leading-[30px] text-neutral-400">
				I'm a skilled software developer with experience in TypeScript and JavaScript, and expertise in
				frameworks like React, Node.js, and Three.js. I'm a quick learner and collaborate closely with clients
				to create efficient, scalable, and user-friendly solutions that solve real-world problems. Let's work
				together to bring your ideas to life!
			</motion.p>
			<div className="mt-20 flex flex-wrap items-center justify-center gap-10">
				{services.map((service, index) => (
					<ServiceCard key={service.title} index={index} {...service} />
				))}
			</div>
		</>
	);
}

export default StarWrapper(About, "about");
