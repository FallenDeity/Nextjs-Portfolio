import { Metadata } from "next";
import React from "react";

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Works from "@/components/Works";
import { meta } from "@/lib/utils";

export function generateMetadata(): Metadata {
	const metadata = meta;
	metadata.title = "Projects";
	metadata.openGraph.title = "Projects";
	metadata.description =
		"Welcome to my projects page! Explore an assortment of meticulously crafted projects I've personally worked on and take pride in.";
	metadata.openGraph.description =
		"Welcome to my projects page! Explore an assortment of meticulously crafted projects I've personally worked on and take pride in.";
	metadata.openGraph.images = "/og.png";
	return metadata;
}

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
