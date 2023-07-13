"use client";

import { motion } from "framer-motion";

import { staggerContainer } from "@/lib/motion";
import { styles } from "@/lib/styles";

const StarWrapper = (Component: React.FC, idName: string): React.FC =>
	function HOC(): React.JSX.Element {
		return (
			<motion.section
				variants={staggerContainer(undefined, undefined)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}>
				<span className="hash-span" id={idName}>
					&nbsp;
				</span>
				<Component />
			</motion.section>
		);
	};

export default StarWrapper;
