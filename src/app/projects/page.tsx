import { Metadata } from "next";
import React from "react";

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Works from "@/components/Works";

export const metadata: Metadata = {
	title: "Projects",
	description: "Projects",
};

export default function Projects(): React.JSX.Element {
	return (
		<div className="relative z-0">
			<div className="bg-project-pattern bg-cover bg-center bg-no-repeat">
				<Navbar />
				<Hero />
			</div>
			<Works />
		</div>
	);
}
