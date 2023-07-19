"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import { testimonials, Testimony } from "@/lib/constants";
import { fadeIn, textVariant } from "@/lib/motion";
import { styles } from "@/lib/styles";

import StarWrapper from "./wrappers/SectionWrapper";

const FeedbackCard = ({ index, testimony }: { index: number; testimony: Testimony }): React.JSX.Element => (
	<motion.div
		initial="hidden"
		whileInView="show"
		viewport={{ once: true }}
		variants={fadeIn("", "spring", index * 0.5, 0.75)}
		className="w-full rounded-3xl bg-black-200 p-10 xs:w-[320px]">
		<p className="text-white text-[48px] font-black">"</p>
		<div className="mt-1">
			<p className="text-white text-[18px] tracking-wider">{testimony.testimonial}</p>
			<div className="mt-7 flex items-center justify-between gap-1">
				<div className="flex flex-1 flex-col">
					<p className="text-white text-[16px] font-medium">
						<span className="blue-text-gradient">@</span> {testimony.name}
					</p>
					<p className="mt-1 text-[12px] text-neutral-300">
						{testimony.designation} of {testimony.company}
					</p>
				</div>
				<Image
					src={testimony.image}
					alt={`feedback_by-${testimony.name}`}
					className="h-10 w-10 rounded-full object-cover"
					width={40}
					height={40}
				/>
			</div>
		</div>
	</motion.div>
);

const Feedbacks = (): React.JSX.Element => {
	return (
		<div className={`mt-12 rounded-[20px] bg-black-100`}>
			<div className={`rounded-2xl bg-neutral-500 bg-opacity-5 ${styles.padding} min-h-[300px]`}>
				<motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
					<p className={styles.sectionSubText}>What others say</p>
					<h2 className={styles.sectionHeadText}>Testimonials</h2>
				</motion.div>
			</div>
			<div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap items-center justify-center gap-7`}>
				{testimonials.map((testimonial, index) => (
					<FeedbackCard key={testimonial.name} index={index} testimony={testimonial} />
				))}
			</div>
		</div>
	);
};

export default StarWrapper(Feedbacks, "Feedbacks");
