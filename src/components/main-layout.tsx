import React from "react";

import { NavigationDock } from "@/components/nav-dock";
import CursorSpotlight from "@/components/ui/cursor-spotlight";
import { Lights } from "@/components/ui/lights";

import CommandPalette from "./command-palette";

export default function MainLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<span className="bg-background relative flex h-screen w-full flex-col">
			<CommandPalette />
			<div className={"bg-grid-black/[0.05] dark:bg-grid-white/[0.03] relative w-full"}>
				<CursorSpotlight from="#ff0000" via="#00ff00" to="#0000ff" opacity="50%" filter="blur(65px)" />
				<Lights />
				<NavigationDock />
				<div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">{children}</div>
			</div>
		</span>
	);
}
