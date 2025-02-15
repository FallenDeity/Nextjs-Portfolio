import "@/styles/globals.css";

import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html
			lang="en"
			className="sm:scrollbar-thin sm:scrollbar-track-background sm:scrollbar-thumb-accent overflow-x-hidden overflow-y-auto">
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
