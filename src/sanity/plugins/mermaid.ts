import { MermaidConfig } from "mermaid";
import { definePlugin } from "sanity";

import mermaidSchema from "../schemas/mermaid";

export const defaultConfig: MermaidConfig = {
	theme: "dark",
	darkMode: true,
};

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const mermaid = definePlugin<MermaidConfig | void>((userConfig = {}) => {
	const config: MermaidConfig = { ...defaultConfig, ...userConfig };
	return {
		name: "sanity-plugin-mermaid",
		schema: {
			types: [mermaidSchema(config)],
		},
	};
});
