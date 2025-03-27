import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";
import { urlFor } from "@/sanity/lib/image";
import { PROFILE_QUERYResult } from "@/sanity/sanity.types";

import { KeenCarousel } from "./components/keen-carousel";

type Project = NonNullable<PROFILE_QUERYResult>["projects"][number];

interface ProjectCardProps {
	projects: Project[];
}

export function ProjectCard({ projects }: ProjectCardProps): React.ReactElement {
	return (
		<BentoCard name="Projects" className="lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2">
			<div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden pb-6">
				<div className="my-6 flex w-full items-center justify-between gap-2 px-6">
					<h2 className="text-start text-xl font-semibold">Projects</h2>
					<Link href="/projects">
						<ExternalLink className="hover:text-foreground text-muted-foreground h-4 w-4 cursor-pointer transition-colors duration-300 ease-in-out" />
					</Link>
				</div>
				<KeenCarousel images={projects.map((project) => urlFor(project.image).url())} />
			</div>
		</BentoCard>
	);
}
