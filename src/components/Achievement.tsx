"use client";

import "@/styles/carousel.css";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Carousel } from "react-responsive-carousel";

import useAchievement, { Achievement } from "@/lib/hooks/getAchievement";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./wrappers/SectionWrapper";

const Achievements = (): React.JSX.Element => {
	const achievements = useAchievement();
	const [picks, setPicks] = React.useState<Achievement[]>([]);
	React.useEffect(() => {
		if (achievements.length) {
			const randomPicks = achievements.sort(() => 0.5 - Math.random()).slice(0, 5);
			setPicks(randomPicks);
		}
	}, [achievements]);
	return (
		<div className="hidden flex-col sm:flex">
			<motion.div
				variants={textVariant()}
				className="flex w-full"
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}>
				<div>
					<p className={`${styles.sectionSubText} `}>Certifications and Awards</p>
					<h2 className={`${styles.sectionHeadText}`}>My Achievements</h2>
				</div>
			</motion.div>
			<div className="flex w-full">
				<motion.p
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					variants={fadeIn("", "", 0.1, 1)}
					className="mt-3 max-w-3xl text-[17px] leading-[30px] text-neutral-300">
					These are some of my achievements that I have earned from various courses and competitions.
				</motion.p>
			</div>
			{Boolean(picks.length) && (
				<Carousel
					className="mt-10 rounded-2xl shadow-[0_35px_120px_-15px_#211e35]"
					dynamicHeight={true}
					showStatus={false}
					showThumbs={false}
					infiniteLoop={true}
					autoPlay={true}
					interval={5000}
					transitionTime={500}
					stopOnHover={true}
					emulateTouch={true}
					swipeable={true}>
					{picks.map((achievement, index) => (
						<Link key={index} href={achievement.link} target="_blank">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<Image
								width={500}
								height={500}
								src={achievement.image}
								alt="achievement_image"
								className="rounded-2xl object-contain"
							/>
							<p className="legend text-white text-center text-xs font-bold">{achievement.name}</p>
						</Link>
					))}
				</Carousel>
			)}
		</div>
	);
};

export default StarWrapper(Achievements, "achievement");
