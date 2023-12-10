import { Metadata } from "next";
import React from "react";

import { meta } from "@/lib/utils";

export function generateMetadata(): Metadata {
	const metadata = meta;
	metadata.title = "Triyan | Portfolio";
	metadata.openGraph.title = "Triyan | Portfolio";
	metadata.description =
		"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.";
	metadata.openGraph.description =
		"Hey There! I am Triyan, an aspiring student from India, driven by a deep passion for crafting impactful software solutions that positively impact people's lives.";
	metadata.openGraph.images = "/og.png";
	return metadata;
}

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en">
			<body style={{ margin: 0 }}>{children}</body>
		</html>
	);
}
