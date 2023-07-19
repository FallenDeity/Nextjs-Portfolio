"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { staggerContainer } from "@/lib/motion";
import { styles } from "@/lib/styles";

const StarWrapper = (Component: React.FC, idName: string): React.FC =>
	function HOC(): React.JSX.Element {
		const pathname = usePathname().replace("/", "");
		return (
			<motion.section
				variants={staggerContainer(undefined, undefined)}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.25 }}
				className={`${styles.padding} relative z-0 mx-auto max-w-7xl`}>
				<span className="hash-span" id={(pathname ? `${pathname}-${idName}` : idName).toLocaleLowerCase()}>
					&nbsp;
				</span>
				<Component />
			</motion.section>
		);
	};

export default StarWrapper;
