import React from "react";

import { NavigationDock } from "@/components/nav-dock";
import { Lights } from "@/components/ui/lights";
import { sanityFetch } from "@/sanity/lib/client";
import { PROFILE_QUERY } from "@/sanity/lib/queries";
import { PROFILE_QUERYResult } from "@/sanity/sanity.types";

import CommandPalette from "./command-palette";
import { Toaster } from "./ui/sonner";

export default async function MainLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
	const profile = await sanityFetch({
		query: PROFILE_QUERY,
		tags: ["profile", "education", "experience", "project"],
	});
	return (
		<main className="scrollbar-none sm:scrollbar-thin sm:scrollbar-track-background sm:scrollbar-thumb-accent relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto">
			<CommandPalette />
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
