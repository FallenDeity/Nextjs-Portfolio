"use client";

import "react-vertical-timeline-component/style.min.css";

import React from "react";

import About from "@/components/About";
import StarsCanvas from "@/components/canvas/StarsCanvas";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Feedback from "@/components/Feedback";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Tech from "@/components/Tech";
import Works from "@/components/Works";

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
			<Feedback />
			<div className="relative z-0">
				<Contact />
				<StarsCanvas />
			</div>
		</div>
	);
}
