"use client";

/**
 * Copyright (c) Samuel Wall.
 *
 * This source code is licensed under the MIT license found in the
 * license file in the root directory of this source tree.
 */

import type { Config } from "mdx-mermaid/lib/config.model";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import React, { ReactElement, useEffect, useMemo, useState } from "react";

export const DEFAULT_DARK_THEME = "dark";
export const DEFAULT_LIGHT_THEME = "default";

export const DARK_THEME_KEY = "dark";
export const LIGHT_THEME_KEY = "light";

export const HTML_THEME_ATTRIBUTE = "data-theme";

type THEME = "default" | "forest" | "dark" | "neutral" | "base";

/**
 * Gets the theme based on config and current data-theme of the HTML.
 *
 * @param html The HTML element of the page.
 * @param config The configuration for this chart.
 */
export function getTheme(htmlTheme: "light" | "dark", config?: Config): THEME {
	if (!(htmlTheme === LIGHT_THEME_KEY || htmlTheme === DARK_THEME_KEY)) {
		htmlTheme = LIGHT_THEME_KEY;
	}

	const defaultTheme = htmlTheme === LIGHT_THEME_KEY ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;

	return (config?.theme?.[htmlTheme] ?? config?.mermaid?.theme ?? defaultTheme) as THEME;
}
/**
 * Properties for Mermaid component.
 */
export interface MermaidProps {
	/**
	 * Mermaid diagram.
	 */
	chart: string;

	/**
	 * Config to initialize mermaid with.
	 */
	config?: Config | string;
}

/**
 * Component to display Mermaid diagrams.
 *
 * @param param0 Diagram to display.
 * @param param1 Config.
 * @returns The component.
 */
export const Mermaid = ({ chart, config: configSrc }: MermaidProps): ReactElement<MermaidProps> => {
	const { resolvedTheme } = useTheme();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const config: Config = useMemo<Config>(
		() => (typeof configSrc === "string" ? JSON.parse(configSrc) : configSrc) as Config,
		[configSrc]
	);

	const theme = useMemo<THEME>(() => getTheme(resolvedTheme as "light" | "dark", config), [resolvedTheme, config]);

	useEffect(() => {
		if (config) {
			if (config.mermaid) {
				mermaid.initialize({ startOnLoad: true, ...config.mermaid, theme });
			} else {
				mermaid.initialize({ startOnLoad: true, theme });
			}
			document.querySelectorAll('div.mermaid[data-processed="true"]').forEach((v) => {
				v.removeAttribute("data-processed");
				v.innerHTML = v.getAttribute("data-mermaid-src") as string;
			});
			mermaid.contentLoaded();
		}
	}, [config, theme]);

	useEffect(() => {
		setTimeout(mermaid.contentLoaded, 0);
	}, [chart]);

	if (!isClient) {
		return <div className="mermaid" data-mermaid-src={chart} data-processed="true" />;
	}

	return (
		<div className="mermaid" data-mermaid-src={chart}>
			{chart}
		</div>
	);
};
