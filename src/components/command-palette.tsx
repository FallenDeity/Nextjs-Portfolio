"use client";

import { Folders, Home, Moon, PencilIcon, Rss, Sun } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useState } from "react";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { useKeyPress } from "@/hooks/use-key-press";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERYResult, PROJECTS_QUERYResult } from "@/sanity/sanity.types";

type Project = PROJECTS_QUERYResult[number];
type Post = POSTS_QUERYResult[number];

export default function CommandPalette({ posts, projects }: { posts: Post[]; projects: Project[] }): React.JSX.Element {
	const [open, setOpen] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useKeyPress({
		keyPressItems: [
			{
				keys: ["Meta", "KeyK"],
				event: (): void => setOpen((prev) => !prev),
			},
			{
				keys: ["Control", "KeyK"],
				event: (): void => setOpen((prev) => !prev),
			},
			{
				keys: ["Escape"],
				event: (): void => setOpen(false),
			},
			{
				keys: ["Meta", "KeyJ"],
				event: (): void => toggleTheme(),
			},
			{
				keys: ["Control", "KeyJ"],
				event: (): void => toggleTheme(),
			},
			{
				keys: ["Meta", "Alt", "KeyH"],
				event: (): void => redirect("/"),
			},
			{
				keys: ["Control", "Alt", "KeyH"],
				event: (): void => redirect("/"),
			},
			{
				keys: ["Meta", "Alt", "KeyP"],
				event: (): void => redirect("/projects"),
			},
			{
				keys: ["Control", "Alt", "KeyP"],
				event: (): void => redirect("/projects"),
			},
			{
				keys: ["Meta", "Alt", "KeyB"],
				event: (): void => redirect("/blog"),
			},
			{
				keys: ["Control", "Alt", "KeyB"],
				event: (): void => redirect("/blog"),
			},
			{
				keys: ["Meta", "Alt", "KeyR"],
				event: (): void => redirect("/pings"),
			},
			{
				keys: ["Control", "Alt", "KeyR"],
				event: (): void => redirect("/pings"),
			},
		],
	});

	const toggleTheme = (): void => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<Command className="rounded-lg border shadow-md md:min-w-[450px]">
				<CommandInput placeholder="Type a command or search..." />
				<CommandList className="scrollbar-thin scrollbar-track-popover scrollbar-thumb-accent">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem onSelect={() => redirect("/")} className="cursor-pointer" value="home">
							<Home className="mr-2 h-4 w-4" />
							<span>Home</span>
							<CommandShortcut>⌘⌥H</CommandShortcut>
						</CommandItem>
						<CommandItem onSelect={() => redirect("/projects")} className="cursor-pointer" value="projects">
							<Folders className="mr-2 h-4 w-4" />
							<span>Projects</span>
							<CommandShortcut>⌘⌥P</CommandShortcut>
						</CommandItem>
						<CommandItem onSelect={() => redirect("/blog")} className="cursor-pointer" value="blog">
							<PencilIcon className="mr-2 h-4 w-4" />
							<span>Blog</span>
							<CommandShortcut>⌘⌥B</CommandShortcut>
						</CommandItem>
						<CommandItem onSelect={() => redirect("/pings")} className="cursor-pointer" value="pings">
							<Rss className="mr-2 h-4 w-4" />
							<span>Pings</span>
							<CommandShortcut>⌘⌥R</CommandShortcut>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Projects">
						{projects.map((project) => (
							<CommandItem
								value={`${project.slug.current} ${project.title}`}
								key={project._id}
								onSelect={() => redirect(`/projects/${project.slug.current}`)}
								className="cursor-pointer">
								<div className="flex w-full flex-row items-center">
									<Image
										src={urlFor(project.image).width(32).height(32).url() || ""}
										alt={project.title}
										width={32}
										height={32}
										className="h-8 w-8 rounded-md"
										placeholder="blur"
										blurDataURL={urlFor(project.image).width(6).height(6).blur(20).url() || ""}
									/>
									<div className="ml-2 flex flex-col">
										<span>{project.title}</span>
										<span className="text-muted-foreground line-clamp-1 text-xs">
											{project.excerpt}
										</span>
									</div>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Blog">
						{posts.map((post) => (
							<CommandItem
								value={`${post.slug.current} ${post.title}`}
								key={post._id}
								onSelect={() => redirect(`/blog/${post.slug.current}`)}
								className="cursor-pointer">
								<div className="flex w-full flex-row items-center">
									<Image
										src={urlFor(post.mainImage).width(32).height(32).url() || ""}
										alt={post.title}
										width={32}
										height={32}
										className="rounded-md"
										placeholder="blur"
										blurDataURL={urlFor(post.mainImage).width(6).height(6).blur(20).url() || ""}
									/>
									<div className="ml-2 flex flex-col">
										<span>{post.title}</span>
										<span className="text-muted-foreground line-clamp-1 text-xs">
											{post.excerpt}
										</span>
									</div>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem onSelect={toggleTheme} className="cursor-pointer" value="theme">
							{resolvedTheme === "dark" ? (
								<Sun className="mr-2 h-4 w-4" />
							) : (
								<Moon className="mr-2 h-4 w-4" />
							)}
							<span>Toggle Theme</span>
							<CommandShortcut>⌘J</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
