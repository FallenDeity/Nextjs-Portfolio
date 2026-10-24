import React from "react";

import { NavigationDock } from "@/components/nav-dock";
import { Lights } from "@/components/ui/lights";
import { imagePlaceholder } from "@/lib/image";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { CONTACT_QUERY, PALETTE_POSTS_QUERY, PALETTE_PROJECTS_QUERY } from "@/sanity/lib/queries";
import { PROFILE_QUERYResult } from "@/sanity/sanity.types";

import CommandPalette, { type PaletteItem } from "./command-palette";
import { Toaster } from "./ui/sonner";

export default async function MainLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
	const [profile, projects, posts] = await Promise.all([
		sanityFetch({ query: CONTACT_QUERY, tags: ["profile"] }),
		sanityFetch({ query: PALETTE_PROJECTS_QUERY, tags: ["project"] }),
		sanityFetch({ query: PALETTE_POSTS_QUERY, tags: ["post"] }),
	]);
	const paletteProjects: PaletteItem[] = projects.map(({ image, ...item }) => ({
		...item,
		imageUrl: urlFor(image).width(32).height(32).url(),
		...imagePlaceholder(image),
	}));
	const palettePosts: PaletteItem[] = posts.map(({ mainImage, ...item }) => ({
		...item,
		imageUrl: urlFor(mainImage).width(32).height(32).url(),
		...imagePlaceholder(mainImage),
	}));
	return (
		<main className="scrollbar-none sm:scrollbar-thin sm:scrollbar-track-background sm:scrollbar-thumb-accent relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto">
			<CommandPalette projects={paletteProjects} posts={palettePosts} contact={profile?.contact} />
			<div className={"bg-grid-black/[0.05] dark:bg-grid-white/[0.03] relative w-full"}>
				<Lights />
				<NavigationDock data={profile?.contact as NonNullable<PROFILE_QUERYResult>["contact"]} />
				<div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center">
					{children}
					<Toaster />
				</div>
			</div>
		</main>
	);
}
