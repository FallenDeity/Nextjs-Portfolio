import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import React from "react";

import Shortcut from "@/components/Shortcut";
import { meta } from "@/lib/utils";

export const metadata: Metadata = meta;

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en">
			<body className="dark scrollbar-thin scrollbar-track-black-100 scrollbar-thumb-gray-700">
				{children}
				<Analytics />
				<Shortcut />
			</body>
		</html>
	);
}
