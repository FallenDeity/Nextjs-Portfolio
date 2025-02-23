import "@/styles/globals.css";

import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import React from "react";

import { DisableDraftMode } from "@/components/draftmode-disable";
import { ThemeProvider } from "@/components/theme-provider";
import CursorSpotlight from "@/components/ui/cursor-spotlight";
import { SanityLive } from "@/sanity/lib/live";

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
	return (
		<html lang="en" className="overflow-hidden">
			<body className="overflow-hidden">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{children}
					<CursorSpotlight opacity="50%" filter="blur(65px)" />
				</ThemeProvider>
				<SanityLive />
				{(await draftMode()).isEnabled && (
					<>
						<DisableDraftMode />
						<VisualEditing />
					</>
				)}
			</body>
		</html>
	);
}
