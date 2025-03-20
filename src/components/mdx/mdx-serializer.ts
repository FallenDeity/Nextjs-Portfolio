"use server";

import { MDXComponents } from "mdx/types";
import mdxMermaid from "mdx-mermaid";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkDeflist from "remark-deflist";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

const mdSerialize = async (source: string, components?: MDXComponents): Promise<ReturnType<typeof compileMDX>> => {
	return await compileMDX({
		source: `# Table of Contents\n\n[[toc]]\n\n${source}`,
		options: {
			mdxOptions: {
				remarkPlugins: [
					remarkGfm,
					remarkDeflist,
					remarkToc,
					remarkMath,
					remarkBreaks,
					remarkEmoji,
					[mdxMermaid, { theme: { light: "default", dark: "dark" }, mermaid: { look: "handDrawn" } }],
				],
				rehypePlugins: [
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
