import { Grid3x3, List } from "lucide-react";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROJECTS_QUERYResult } from "@/sanity/sanity.types";

import { ProjectCard } from "./project-card";
import { ProjectListItem } from "./project-list-item";
import ProjectsAdvancedCarousel from "./projects-carousel";

type Project = NonNullable<PROJECTS_QUERYResult>[number];

interface ProjectListingProps {
	projects: Project[];
}

export default function ProjectListing({ projects }: ProjectListingProps): React.ReactElement {
	return (
		<Tabs
			defaultValue="grid"
			className="z-10 m-6 mx-auto mb-96 min-h-screen w-full max-w-5xl overflow-hidden p-4 md:mb-64 lg:mb-36">
			<div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row">
				<div>
					<h1 className="text-6xl font-bold">Projects</h1>
					<p className="text-muted-foreground mt-4">A collection of my work and side projects</p>
				</div>
				<div className="flex flex-row items-center justify-end gap-4">
					<div className="w-full md:w-auto">
						<TabsList className="bg-background/40 flex gap-2 border backdrop-blur-xl backdrop-filter">
							<TabsTrigger value="grid" className="data-[state=active]:bg-accent">
								<Grid3x3 className="mr-1 h-4 w-4" />
								Grid
							</TabsTrigger>
							<TabsTrigger value="list" className="data-[state=active]:bg-accent">
								<List className="mr-1 h-4 w-4" />
								List
							</TabsTrigger>
						</TabsList>
					</div>
				</div>
			</div>
			<div className="w-full">
				<TabsContent value="grid" className="mt-0">
					<ProjectsAdvancedCarousel projects={projects} />

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{projects.map((project, index) => (
							<ProjectCard key={index} project={project} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="list" className="mt-0">
					<div className="space-y-6">
						{projects.map((project, index) => (
							<ProjectListItem key={index} project={project} />
						))}
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
