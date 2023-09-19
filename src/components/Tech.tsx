"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Tilt from "react-parallax-tilt";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useTech from "@/lib/hooks/getTech";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./wrappers/SectionWrapper";

const Tech = (): React.JSX.Element => {
	const technologies = useTech();
	return (
		<>
			<motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
				<p className={`${styles.sectionSubText} text-center`}>Technologies I am familiar with</p>
				<h2 className={`${styles.sectionHeadText} text-center`}>Technologies</h2>
			</motion.div>
			<div className="mt-20 flex flex-row flex-wrap justify-center gap-10">
				{technologies.map((technology, index) => (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Tilt key={technology.name}>
									<motion.div
										initial="hidden"
										whileInView="show"
										viewport={{ once: true }}
										variants={fadeIn("up", "spring", index * 0.2, 0.65)}
										className="green-border-gradient flex h-28 w-28 cursor-pointer items-center justify-center rounded-full p-1 shadow-[0_35px_120px_-15px_#211e35]"
										key={technology.name}>
										<div className="flex h-full w-full items-center justify-center rounded-full bg-background">
											<Image
												src={technology.logo}
												alt={technology.name}
												width={100}
												height={100}
												className="h-20 w-20 rounded-full object-contain"
											/>
										</div>
									</motion.div>
								</Tilt>
							</TooltipTrigger>
							<TooltipContent sideOffset={5}>
								<p>{technology.name}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</div>
		</>
	);
};

export default StarWrapper(Tech, "Technologies");
