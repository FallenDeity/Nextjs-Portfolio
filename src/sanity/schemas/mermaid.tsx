import { MermaidConfig } from "mermaid";
import { defineType, ObjectDefinition } from "sanity";

import { MermaidPreview } from "@/sanity/components/mermaid-input";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mermaidTypeName = "mermaid";

export interface MermaidDefinition extends Omit<ObjectDefinition, "type" | "fields"> {
	type: typeof mermaidTypeName;
}

declare module "@sanity/types" {
	export interface IntrinsicDefinitions {
		mermaid: MermaidDefinition;
	}
}

export default function (config: MermaidConfig): ReturnType<typeof defineType> {
	return defineType({
		title: "Mermaid graph",
		name: "mermaid",
		type: "object",
		components: {
			preview: (props) => <MermaidPreview {...props} config={config} />,
		},
		fields: [
			{
				title: "Graph",
				name: "graph",
				type: "text",
			},
		],
		preview: {
			select: {
				graph: "graph",
			},
		},
	});
}
