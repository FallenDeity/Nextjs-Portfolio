import { Heading, Root } from "mdast";
import { MDXComponents } from "mdx/types";
import mdxMermaid from "mdx-mermaid";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeColorChips from "rehype-color-chips";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkDeflist from "remark-deflist";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

const remarkInsertTOC =
	() =>
	(tree: Root): void => {
		let hasH1 = false;
		let h1Inserted = false;

		const newChildren = [];

		for (const node of tree.children) {
			// Detect if there's an H1
			if (node.type === "heading" && node.depth === 1) {
				hasH1 = true;
				newChildren.push(node);

				// Insert "## Table of Contents" heading after the first H1
				if (!h1Inserted) {
					newChildren.push({
						type: "heading",
						depth: 2,
						children: [{ type: "text", value: "Table of Contents" }],
					} as Heading);
					h1Inserted = true;
				}
			} else {
				newChildren.push(node);
			}
		}

		// If no H1 exists, prepend "Table of Contents" as H1
		if (!hasH1) {
			newChildren.unshift({
				type: "heading",
				depth: 1,
				children: [{ type: "text", value: "Table of Contents" }],
			} as Heading);
		}

		tree.children = newChildren;
	};

const mdSerialize = async (source: string, components?: MDXComponents): Promise<ReturnType<typeof compileMDX>> => {
	return await compileMDX({
		source: source,
		options: {
			mdxOptions: {
				remarkPlugins: [
					remarkGfm,
					remarkDeflist,
					remarkMath,
					remarkBreaks,
					remarkEmoji,
					remarkInsertTOC,
					remarkToc,
					[mdxMermaid, { theme: { light: "default", dark: "dark" }, mermaid: { look: "handDrawn" } }],
				],
				rehypePlugins: [
					rehypeColorChips,
					[
						rehypePrettyCode,
						{
							theme: {
								light: "catppuccin-latte",
								dark: "catppuccin-macchiato",
							},
						},
					],
					rehypeKatex,
					rehypeSlug,
					[
						rehypeAutolinkHeadings,
						{
							behavior: "wrap",
							properties: { className: ["section_heading"] },
						},
					],
				],
			},
		},
		components,
	});
};

export { mdSerialize };
