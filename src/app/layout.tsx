import "@/styles/globals.css";
import "easymde/dist/easymde.min.css";

import React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import CursorSpotlight from "@/components/ui/cursor-spotlight";
import { metadataConfig } from "@/lib/metadata";

export const metadata = metadataConfig;

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en" className="overflow-hidden">
			<body className="overflow-hidden">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{children}
					<CursorSpotlight opacity="50%" filter="blur(65px)" />
				</ThemeProvider>
			</body>
		</html>
	);
}
