/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { Flex, ThemeColorProvider } from "@sanity/ui";
import { MermaidConfig } from "mermaid";
import React, { useEffect } from "react";
import { PreviewProps } from "sanity";

interface MermaidInputValue {
	graph?: string;
}

interface MermaidStringInput extends PreviewProps, MermaidInputValue {
	config: MermaidConfig;
}

export function MermaidPreview(props: MermaidStringInput): React.ReactNode {
	const { config, graph } = props;

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
		script.onload = (): void => {
			// @ts-expect-error - mermaid is a global
			window.mermaid.initialize(config);
			// @ts-expect-error - mermaid is a global
			window.mermaid.contentLoaded();
		};
		document.body.appendChild(script);

		return (): void => {
			document.body.removeChild(script);
		};
	}, [config]);

	return (
		<ThemeColorProvider>
			<Flex justify="center" height="fill">
				<div className="mermaid">{graph ?? "graph TD"}</div>
			</Flex>
		</ThemeColorProvider>
	);
}
