import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Calendar, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CARD_STYLE_STRING, cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PROJECTS_QUERYResult } from "@/sanity/sanity.types";

type Project = NonNullable<PROJECTS_QUERYResult>[number];

export function ProjectListItem({ project }: { project: Project }): React.ReactElement {
	return (
		<div className={cn("overflow-hidden rounded-xl", CARD_STYLE_STRING)}>
			<div className="flex flex-col md:flex-row">
				<div className="relative h-48 w-full md:h-auto md:w-64">
					<Image src={urlFor(project.image).url()} alt={project.title} fill className="object-cover" />
				</div>
				<div className="flex flex-1 flex-col p-6">
					<div className="mb-2 flex items-start justify-between">
						<p className="text-xl font-bold">{project.title}</p>
						<div className="text-muted-foreground flex items-center text-sm">
							<Calendar size={14} className="mr-1" />
							{formatDistanceToNow(new Date(project.publishedAt), { addSuffix: true })}
						</div>
					</div>

					<p className="text-muted-foreground mb-4 flex-grow text-sm">{project.description}</p>

					<div className="mb-4 flex flex-wrap gap-2">
						{project.tags.map((tech) => (
							<span
								key={tech.slug.current}
								className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs lowercase">
								#{tech.slug.current}
							</span>
						))}
					</div>

					<div className="mt-2 flex items-center justify-between">
						<div className="flex gap-3">
							{project.source && (
								<Link
									aria-label="View source code"
									prefetch={false}
									href={project.source}
									className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out">
									<Github size={18} />
								</Link>
							)}
							{project.demo && (
								<Link
									aria-label="View live demo"
									prefetch={false}
									href={project.demo}
									className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out">
									<ExternalLink size={18} />
								</Link>
							)}
						</div>
						<Link
							prefetch={false}
							aria-label="View project details"
							href={`/projects/${project.slug.current}`}
							className="flex items-center text-sm text-blue-400 transition-colors duration-300 ease-in-out hover:text-blue-300">
							View Details
							<ArrowUpRight size={14} className="ml-1" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
