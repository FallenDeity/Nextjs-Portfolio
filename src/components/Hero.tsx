"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Typewriter from "typewriter-effect";

import ComputerCanvas from "@/components/canvas/ComputerCanvas";
import { styles } from "@/lib/styles";

import CraftsmanCanvas from "./canvas/ProjectCanvas";

export default function Hero(): React.JSX.Element {
	const pathname = usePathname();
	return (
		<section className="relative mx-auto h-screen w-full">
			<div className={`${styles.paddingX} absolute inset-0 top-[120px] mx-auto flex flex-row items-start gap-5`}>
				<div className="mt-5 flex flex-col items-center justify-center">
					<div
						className={`h-5 w-5 rounded-full ${
							pathname.includes("/projects") ? "bg-[#edde5d]" : "bg-[#804dee]"
						}`}
					/>
					<div
						className={`h-40 w-1 sm:h-80 ${
							pathname.includes("/projects") ? "golden-gradient" : "violet-gradient"
						}`}
					/>
				</div>
				<div>
					<Typewriter
						options={{
							autoStart: true,
							delay: 30,
							cursor: "",
						}}
						onInit={(typewriter): void => {
							typewriter
								.typeString(
									pathname.includes("/projects")
										? "<h1 class='font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[45px] text-[35px] lg:leading-[98px] mt-2 text-white'>My <span class='text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-600'>Projects</span></h1>"
										: "<h1 class='font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[45px] text-[35px] lg:leading-[98px] mt-2 text-white'>Hi, I'm <span class='text-transparent bg-clip-text bg-gradient-to-br from-purple-700 to-rose-500'>Triyan</span></h1>"
								)
								.typeString(
									pathname.includes("/projects")
										? "<p class='text-[#fff5d9] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-2'>Welcome to my projects page, <br class='hidden sm:block' /> feel free to explore!</p>"
										: "<p class='text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-2'>I'm a Fullstack Developer, I<br class='hidden sm:block' /> love to build things with code</p>"
								)
								.start();
						}}
					/>
				</div>
			</div>
			{pathname.includes("/projects") ? <CraftsmanCanvas /> : <ComputerCanvas />}
			<div className="absolute bottom-32 flex w-full items-center justify-center xs:bottom-10">
				<Link aria-label="content" href={pathname.includes("/projects") ? "#projects-works" : "#about"}>
					<div className="flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-neutral-300 p-2">
						<motion.div
							initial="hidden"
							whileInView="show"
							viewport={{ once: true }}
							animate={{
								y: [0, 24, 0],
							}}
							transition={{
								duration: 2,
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
