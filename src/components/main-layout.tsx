import React from "react";

import { NavigationDock } from "@/components/nav-dock";
import { Lights } from "@/components/ui/lights";

import CommandPalette from "./command-palette";

export default function MainLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<main className="sm:scrollbar-thin sm:scrollbar-track-background sm:scrollbar-thumb-accent relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto">
			<CommandPalette />
			<div className={"bg-grid-black/[0.05] dark:bg-grid-white/[0.03] relative w-full"}>
				<Lights />
				<NavigationDock />
				<div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center">{children}</div>
			</div>
		</main>
	);
}
