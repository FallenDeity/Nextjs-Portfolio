"use client";

import { motion } from "framer-motion";
import React from "react";

import { technologies } from "@/lib/constants";
import { textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import BallCanvas from "./canvas/BallCanvas";
import StarWrapper from "./SectionWrapper";

const Tech = (): React.JSX.Element => {
	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={`${styles.sectionSubText} text-center`}>Technologies I am familiar with</p>
				<h2 className={`${styles.sectionHeadText} text-center`}>Technologies</h2>
			</motion.div>
			<div className="mt-20 flex flex-row flex-wrap justify-center gap-10">
				{technologies.map((technology) => (
					<div className="h-28 w-28" key={technology.name}>
						<BallCanvas icon={technology.icon} />
					</div>
				))}
			</div>
		</>
	);
};

export default StarWrapper(Tech, "Technologies");
