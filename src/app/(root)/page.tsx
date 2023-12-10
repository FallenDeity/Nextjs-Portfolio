import "react-vertical-timeline-component/style.min.css";

import { Metadata } from "next";
import React from "react";

import About from "@/components/About";
import Achievement from "@/components/Achievement";
import StarsCanvas from "@/components/canvas/StarsCanvas";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Tech from "@/components/Tech";
import Works from "@/components/Works";
import { meta } from "@/lib/utils";

export function generateMetadata(): Metadata {
	const metadata = meta;
	metadata.title = "Triyan | Portfolio";
	metadata.openGraph.title = "Triyan | Portfolio";
	metadata.description =
		"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.";
	metadata.openGraph.description =
		"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.";
	metadata.openGraph.images = "/og.png";
	return metadata;
}

export default function Home(): React.JSX.Element {
	return (
		<div className="relative z-0">
			<div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
				<Navbar />
				<Hero />
			</div>
			<About />
			<Experience />
			<Tech />
			<Works />
			<Achievement />
			<div className="relative z-0">
				<Contact />
				<StarsCanvas />
			</div>
		</div>
	);
}
