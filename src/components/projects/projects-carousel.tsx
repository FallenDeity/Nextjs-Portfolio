"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PROJECTS_QUERYResult } from "@/sanity/sanity.types";

import { Button } from "../ui/button";

type Project = PROJECTS_QUERYResult[number];

interface ProjectCarouselProps {
	projects: Project[];
}

export default function ProjectsAdvancedCarousel({ projects }: ProjectCarouselProps): React.ReactElement | null {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [autoplay, setAutoplay] = useState(true);
	const [isAnimating, setIsAnimating] = useState(false);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);
	const carouselRef = useRef(null);

	const featuredProjects = projects.slice(0, 5); // Use first 5 projects as featured

	const goToSlide = useCallback(
		(index: number) => {
			if (isAnimating) return;
			setIsAnimating(true);
			setCurrentSlide(index);
			setTimeout(() => setIsAnimating(false), 500); // Match transition duration
		},
		[isAnimating]
	);

	const nextSlide = useCallback(() => {
		goToSlide(currentSlide === featuredProjects.length - 1 ? 0 : currentSlide + 1);
	}, [currentSlide, featuredProjects.length, goToSlide]);

	const prevSlide = useCallback(() => {
		goToSlide(currentSlide === 0 ? featuredProjects.length - 1 : currentSlide - 1);
	}, [currentSlide, featuredProjects.length, goToSlide]);

	// Autoplay functionality
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (autoplay) {
			interval = setInterval(() => {
				nextSlide();
			}, 5000);
		}
		return (): void => clearInterval(interval);
	}, [autoplay, nextSlide]);

	// Handle touch events for swipe
	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = (): void => {
		if (touchStart - touchEnd > 100) {
			// Swipe left
			nextSlide();
		}

		if (touchStart - touchEnd < -100) {
			// Swipe right
			prevSlide();
		}
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent): void => {
			if (e.key === "ArrowLeft") {
				prevSlide();
			} else if (e.key === "ArrowRight") {
				nextSlide();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return (): void => window.removeEventListener("keydown", handleKeyDown);
	}, [nextSlide, prevSlide]);

	if (featuredProjects.length === 0) return null;

	return (
		<div className="mb-12">
			{/* <h2 className="mb-4 text-xl font-semibold">Featured Projects</h2> */}
			<div
				ref={carouselRef}
				className="bg-background group relative overflow-hidden rounded-xl shadow-xl dark:border dark:shadow-none"
				onMouseEnter={() => setAutoplay(false)}
				onMouseLeave={() => setAutoplay(true)}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				tabIndex={0}
				role="region"
				aria-label="Featured projects carousel">
				<div className="dark relative h-[300px] overflow-hidden md:h-[400px]">
					<div
						className="flex h-full transition-transform duration-500 ease-out"
						style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
						{featuredProjects.map((project, index) => (
							<div
								key={index}
								className="relative h-full min-w-full"
								aria-hidden={currentSlide !== index}>
								<Image
									src={urlFor(project.image).url() || "/placeholder.svg?height=400&width=800"}
									alt={project.title}
									fill
									className="object-cover"
									priority={index === 0}
								/>
								<div className="from-background via-background/70 absolute inset-0 bg-gradient-to-t to-transparent opacity-90" />
								<div className="absolute bottom-0 left-0 w-full p-6">
									<h3 className="text-foreground mb-2 text-2xl font-bold">{project.title}</h3>
									<p className="text-muted-foreground mb-4 line-clamp-2 max-w-3xl">
										{project.description}
									</p>
									<div className="mb-4 flex flex-wrap gap-2">
										{project.tags.map((tech) => (
											<span
												key={tech.slug.current}
												className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs lowercase">
												#{tech.slug.current}
											</span>
										))}
									</div>
									<div className="flex flex-wrap gap-4">
										{project.source && (
											<Link href={project.source} prefetch={false}>
												<Button
													variant={"outline"}
													className="text-foreground flex cursor-pointer items-center gap-1 px-3 py-1.5 text-sm transition-all duration-300 ease-in-out">
													<Github size={16} />
													<span>Source Code</span>
												</Button>
											</Link>
										)}
										{project.demo && (
											<Link href={project.demo} prefetch={false}>
												<Button
													variant={"outline"}
													className="text-foreground flex cursor-pointer items-center gap-1 px-3 py-1.5 text-sm transition-all duration-300 ease-in-out">
													<ExternalLink size={16} />
													<span>Live Demo</span>
												</Button>
											</Link>
										)}
										<Link href={`/projects/${project.slug.current}`}>
											<Button
												variant={"link"}
												className="flex cursor-pointer items-center gap-1 px-3 py-1.5 text-sm">
												<span>View Details</span>
												<ArrowUpRight size={16} />
											</Button>
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>

					<LazyMotion features={domAnimation}>
						<m.button
							onClick={prevSlide}
							whileHover={{ scale: 1.1 }}
							className="group-hover:animate-in group-hover:slide-in-from-left absolute top-1/2 left-4 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white backdrop-blur-sm backdrop-filter group-hover:block"
							aria-label="Previous slide"
							disabled={isAnimating}>
							<ChevronLeft size={24} />
						</m.button>
					</LazyMotion>
					<LazyMotion features={domAnimation}>
						<m.button
							onClick={nextSlide}
							whileHover={{ scale: 1.1 }}
							className="group-hover:animate-in group-hover:slide-in-from-right absolute top-1/2 right-4 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white backdrop-blur-sm backdrop-filter group-hover:block"
							aria-label="Next slide"
							disabled={isAnimating}>
							<ChevronRight size={24} />
						</m.button>
					</LazyMotion>

					{/* Indicators */}
					<div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
						{featuredProjects.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={cn(
									"h-2 w-2 rounded-full transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none",
									currentSlide === index ? "w-6 bg-white" : "bg-white/50 hover:bg-white/80"
								)}
								aria-label={`Go to slide ${index + 1}`}
								aria-current={currentSlide === index ? "true" : "false"}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
