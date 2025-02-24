import { DividerHorizontalIcon } from "@radix-ui/react-icons";
import { ImageIcon } from "@sanity/icons";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	EyeOff,
	Link,
	Sigma,
	Subscript,
	Superscript,
	Workflow,
} from "lucide-react";
import React from "react";
import { defineArrayMember, defineType } from "sanity";

import { TextAlign } from "../components/text-align";

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
	title: "Block Content",
	name: "blockContent",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			// Styles let you define what blocks can be marked up as. The default
			// set corresponds with HTML tags, but you can set any title or value
			// you want, and decide how you want to deal with it where you want to
			// use your content.
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "H1", value: "h1" },
				{ title: "H2", value: "h2" },
				{ title: "H3", value: "h3" },
				{ title: "H4", value: "h4" },
				{ title: "H5", value: "h5" },
				{ title: "H6", value: "h6" },
				{ title: "Quote", value: "blockquote" },
			],
			lists: [
				{ title: "Bullet", value: "bullet" },
				{ title: "Number", value: "number" },
			],
			// Marks let you mark up inline text in the Portable Text Editor
			marks: {
				// Decorators usually describe a single property – e.g. a typographic
				// preference or highlighting
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
					{ title: "Strike", value: "strike-through" },
					{ title: "Code", value: "code" },
					{ title: "Underline", value: "underline" },
					{
						title: "Left",
						value: "left",
						icon: (): React.ReactElement => <AlignLeft className="h-3 w-3" />,
						component: (
							props: React.PropsWithChildren<React.ReactNode> & { value: "left" }
						): React.ReactElement => TextAlign(props),
					},
					{
						title: "Center",
						value: "center",
						icon: (): React.ReactElement => <AlignCenter className="h-3 w-3" />,
						component: (
							props: React.PropsWithChildren<React.ReactNode> & { value: "center" }
						): React.ReactElement => TextAlign(props),
					},
					{
						title: "Right",
						value: "right",
						icon: (): React.ReactElement => <AlignRight className="h-3 w-3" />,
						component: (
							props: React.PropsWithChildren<React.ReactNode> & { value: "right" }
						): React.ReactElement => TextAlign(props),
					},
					{
						title: "Highlight",
						value: "highlight",
						icon: (): React.ReactElement => <span style={{ fontWeight: "bold" }}>H</span>,
						component: (props: React.PropsWithChildren<React.ReactNode>): React.ReactElement => (
							<mark className="bg-accent text-accent-foreground px-1.5">{props.children}</mark>
						),
					},
					{
						title: "Subscript",
						value: "sub",
						icon: Subscript,
						component: (props: React.PropsWithChildren<React.ReactNode>): React.ReactElement => (
							<sub>{props.children}</sub>
						),
					},
					{
						title: "Superscript",
						value: "sup",
						icon: Superscript,
						component: (props: React.PropsWithChildren<React.ReactNode>): React.ReactElement => (
							<sup>{props.children}</sup>
						),
					},
					{
						title: "Divider",
						icon: DividerHorizontalIcon,
						component: (
							props: React.PropsWithChildren<React.ReactNode> & {
								renderDefault: (props: React.PropsWithChildren<React.ReactNode>) => React.JSX.Element;
							}
						): React.ReactElement => (
							<span>
								<hr contentEditable={false} />
								{props.renderDefault(props)}
							</span>
						),
						value: "hr",
					},
					{
						title: "Spoiler",
						value: "spoiler",
						icon: (): React.ReactElement => <EyeOff className="h-3 w-3" />,
						component: (props: React.PropsWithChildren<React.ReactNode>): React.ReactElement => (
							<div className="bg-secondary text-secondary-foreground relative inline-flex w-fit cursor-pointer rounded-sm px-1.5">
								<p className="opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
									<em>{props.children}</em>
								</p>
							</div>
						),
					},
				],
				// Annotations can be any object structure – e.g. a link or a footnote.
				annotations: [
					{
						title: "URL",
						name: "link",
						type: "object",
						icon: (): React.ReactElement => <Link className="h-3 w-3" />,
						fields: [
							{
								title: "URL",
								name: "href",
								type: "url",
							},
						],
					},
					{
						title: "Internal Link",
						name: "internalLink",
						type: "object",
						icon: (): React.ReactElement => <Link className="h-3 w-3" />,
						fields: [
							{
								title: "Reference",
								name: "reference",
								type: "reference",
								to: [{ type: "post" }, { type: "author" }, { type: "category" }],
							},
						],
					},
				],
			},
		}),
		// You can add additional types here. Note that you can't use
		// primitive types such as 'string' and 'number' in the same array
		// as a block type.
		defineArrayMember({
			type: "image",
			icon: ImageIcon,
			options: { hotspot: true },
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alternative Text",
				},
				{
					name: "height",
					type: "number",
					title: "Height",
				},
				{
					name: "width",
					type: "number",
					title: "Width",
				},
			],
		}),
		defineArrayMember({
			type: "code",
			title: "Code Block",
			options: {
				withFilename: true, // optional
			},
		}),
		defineArrayMember({
			type: "latex",
			title: "LaTeX",
			icon: Sigma,
		}),
		defineArrayMember({
			type: "mermaid",
			title: "Flowchart",
			icon: Workflow,
		}),
	],
});
