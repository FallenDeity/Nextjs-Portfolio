import { getImageDimensions } from "@sanity/asset-utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { CARD_STYLE_STRING, cn, CUSTOM_LOGOS } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { NEXT_PREV_PROJECTS_QUERYResult, PROJECT_QUERYResult } from "@/sanity/sanity.types";

import { Button } from "../ui/button";
import { Gallery } from "./image-gallery";

type Project = NonNullable<PROJECT_QUERYResult>;

interface ProjectDetailProps {
	project: Project;
	nextPrev: NEXT_PREV_PROJECTS_QUERYResult;
}

export default function ProjectDetail({ project, nextPrev }: ProjectDetailProps): React.ReactElement {
	return (
		<div className="mx-auto mb-44 flex w-full max-w-5xl flex-col items-center justify-center md:m-6 md:mb-36">
			<div className={cn("flex w-full flex-col md:m-6 md:rounded-xl", CARD_STYLE_STRING)}>
				<div className="dark relative mb-8 h-[300px] overflow-hidden md:h-[400px] md:rounded-xl">
					<Image
						priority
						src={urlFor(project.image).url() || "/placeholder.svg"}
						alt={project.title}
						fill
						className="object-cover"
					/>
					<div className="from-background via-background/70 absolute inset-0 bg-gradient-to-t to-transparent opacity-90" />
					<div className="absolute bottom-0 left-0 p-6">
						<h1 className="text-foreground mb-2 text-3xl font-bold md:text-4xl">{project.title}</h1>
						<p className="text-muted-foreground mb-4 max-w-3xl">{project.excerpt}</p>
						<div className="mb-4 flex flex-wrap gap-2">
							{project.tags.map((tech) => (
								<span
									key={tech.slug.current}
									className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs lowercase">
									#{tech.slug.current}
								</span>
							))}
						</div>
						<div className="flex gap-4">
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
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 px-6 md:grid-cols-3">
					<div className="md:col-span-2">
						<h2 className="mb-4 text-xl font-semibold">About the Project</h2>
						<div className="space-y-4">
							{project.description.split("\n\n").map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>
					</div>
					<div
						className={cn(
							"rounded-xl p-6 md:col-span-1",
							"bg-card/40 transform-gpu [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]"
						)}>
						<div>
							<h2 className="mb-4 text-xl font-semibold">Project Details</h2>
							<div className="space-y-4">
								<div className="grid grid-flow-col grid-cols-2 gap-6">
									<div className="col-span-1 flex flex-col">
										<h3 className="font-semibold">Date</h3>
										<p className="text-muted-foreground flex items-center text-sm">
											<Calendar size={14} className="mr-2" />
											{formatDistanceToNow(new Date(project.publishedAt), { addSuffix: true })}
										</p>
									</div>
									<div className="col-span-1 flex flex-col">
										<h3 className="font-semibold">Links</h3>
										<div className="mt-2 flex gap-3">
											{project.source && (
												<Link
													prefetch={false}
													href={project.source}
													className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out">
													<Github size={18} />
												</Link>
											)}
											{project.demo && (
												<Link
													prefetch={false}
													href={project.demo}
													className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out">
													<ExternalLink size={18} />
												</Link>
											)}
										</div>
									</div>
								</div>
								<div>
									<h3 className="font-semibold">Technologies</h3>
									<div className="mt-2 flex flex-wrap gap-2">
										{(project.technologies ?? []).map((tech, index) => (
											<Image
												className="bg-primary/10 rounded-full p-1"
												key={index}
												src={
													CUSTOM_LOGOS.includes(tech)
														? `/${tech}.svg`
														: `https://cdn.simpleicons.org/${tech}`
												}
												alt={tech}
												width={26}
												height={26}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="my-12 px-6">
					<h2 className="mb-4 text-xl font-semibold">Key Features</h2>
					<ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{(project.features ?? []).map((feature, index) => (
							<li key={index} className="flex items-center">
								<div className="mr-2 text-blue-500">•</div>
								<span className="text-muted-foreground text-sm tracking-tight">{feature}</span>
							</li>
						))}
					</ul>
				</div>

				{project.screenshots && project.screenshots.length > 0 && (
					<div className="mb-12 px-6">
						<h2 className="mb-4 text-xl font-semibold">Screenshots</h2>
						<Gallery
							images={project.screenshots.map((image) => ({
								src: urlFor(image).url(),
								alt: project.title,
								thumb: urlFor(image).width(480).url(),
								width: getImageDimensions(image.asset?._ref ?? "").width.toString(),
								height: getImageDimensions(image.asset?._ref ?? "").height.toString(),
							}))}
						/>
					</div>
				)}
			</div>
			<div
				className={`mx-6 mt-6 flex w-full max-w-5xl flex-col gap-6 md:mt-0 md:justify-between ${nextPrev && !nextPrev.prev ? "md:flex-row-reverse" : "md:flex-row"}`}>
				{nextPrev && nextPrev.prev && (
					<Link
						href={`/projects/${nextPrev.prev.slug.current}`}
						className={cn("flex w-full justify-start rounded-lg p-4 md:w-1/2", CARD_STYLE_STRING)}>
						<div className="flex w-full flex-row items-center justify-between gap-2">
							<ArrowLeft className="h-6 w-6" />
							<div className="flex w-full flex-col items-end">
								<p>{nextPrev.prev.title}</p>
								<p className="text-muted-foreground line-clamp-1 max-w-4/5 text-xs text-ellipsis">
									{nextPrev.prev.excerpt}
								</p>
							</div>
						</div>
					</Link>
				)}
				{nextPrev && nextPrev.next && (
					<Link
						href={`/projects/${nextPrev.next.slug.current}`}
						className={cn("flex w-full justify-end rounded-lg p-4 md:w-1/2", CARD_STYLE_STRING)}>
						<div className="flex w-full flex-row items-center justify-between gap-2">
							<div className="flex w-full flex-col items-start">
								<p>{nextPrev.next.title}</p>
								<p className="text-muted-foreground line-clamp-1 max-w-4/5 text-xs text-ellipsis">
									{nextPrev.next.excerpt}
								</p>
							</div>
							<ArrowRight className="h-6 w-6" />
						</div>
					</Link>
				)}
			</div>
		</div>
	);
}
