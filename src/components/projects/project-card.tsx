import { formatDistanceToNow } from "date-fns";
import { Calendar, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CARD_STYLE_STRING, cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PROJECTS_QUERYResult } from "@/sanity/sanity.types";

type Project = NonNullable<PROJECTS_QUERYResult>[number];

export function ProjectCard({ project }: { project: Project }): React.ReactElement {
	return (
		<div className={cn("group flex cursor-pointer flex-col overflow-hidden rounded-xl", CARD_STYLE_STRING)}>
			<div className="relative flex h-48">
				<Image
					src={urlFor(project.image).url()}
					alt={project.title}
					fill
					className="object-cover transition-transform duration-300 group-hover:translate-y-[-5px] group-hover:scale-105"
				/>
				{/* <div className="from-zinc-900 absolute inset-0 bg-gradient-to-t to-transparent opacity-90" /> */}
			</div>
			<div className="flex h-auto flex-col justify-between p-4">
				<div className="flex flex-col">
					<div className="mb-3 flex items-start justify-between">
						<p className="text-xl font-bold">{project.title}</p>
						<div className="flex gap-2">
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
					</div>
					<p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{project.description}</p>
				</div>
				<div className="flex flex-col">
					<div className="mb-4 flex flex-wrap gap-2">
						{project.tags.slice(0, 4).map((tech) => (
							<span
								key={tech.slug.current}
								className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs whitespace-nowrap lowercase">
								#{tech.slug.current}
							</span>
						))}
						{project.tags.length > 4 && (
							<span className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs lowercase">
								+{project.tags.length - 4}
							</span>
						)}
					</div>
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground flex items-center text-sm">
							<Calendar size={14} className="mr-1" />
							{formatDistanceToNow(new Date(project.publishedAt), { addSuffix: true })}
						</div>
						<Link
							aria-label="View project details"
							prefetch={false}
							href={`/projects/${project.slug.current}`}
							className="text-sm text-blue-400 transition-colors duration-300 ease-in-out hover:text-blue-300">
							View Details
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
