import "@/styles/globals.css";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Portfolio",
	description: "Triyan's Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en">
			<body className="dark scrollbar-thin scrollbar-track-black-100 scrollbar-thumb-gray-700">{children}</body>
		</html>
	);
}
