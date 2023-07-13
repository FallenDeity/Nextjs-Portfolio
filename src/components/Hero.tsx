"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import ComputerCanvas from "@/components/canvas/ComputerCanvas";
import { styles } from "@/lib/styles";

export default function Hero(): React.JSX.Element {
	return (
		<section className="relative mx-auto h-screen w-full">
			<div className={`${styles.paddingX} absolute inset-0 top-[120px] mx-auto flex flex-row items-start gap-5`}>
				<div className="mt-5 flex flex-col items-center justify-center">
					<div className="h-5 w-5 rounded-full bg-[#915eff]" />
					<div className="violet-gradient h-40 w-1 sm:h-80" />
				</div>
				<div>
					<h1 className={`${styles.heroHeadText} text-white`}>
						Hi, I'm <span className="text-[#915eff]">Triyan</span>
					</h1>
					<p className={`${styles.heroSubText} mt-2 text-neutral-200`}>
						I'm a Fullstack Developer, I<br className="hidden sm:block" /> love to build things with code
					</p>
				</div>
			</div>
			<ComputerCanvas />
			<div className="absolute bottom-32 flex w-full items-center justify-center xs:bottom-10">
				<Link href="#about">
					<div className="flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-neutral-300 p-2">
						<motion.div
							animate={{
								y: [0, 24, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								repeatType: "loop",
							}}
							className="mb-1 h-3 w-3 rounded-full bg-neutral-300"
						/>
					</div>
				</Link>
			</div>
		</section>
	);
}
