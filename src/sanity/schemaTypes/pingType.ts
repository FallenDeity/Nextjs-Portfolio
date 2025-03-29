import { Rss } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const pingType = defineType({
	name: "ping",
	title: "Ping",
	type: "document",
	icon: Rss,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "markdown",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative text",
					validation: (Rule) => Rule.required(),
				}),
			],
		}),
		defineField({
			name: "link",
			title: "Link",
			type: "url",
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
		}),
	],
	preview: {
		select: {
			title: "title",
			media: "image",
		},
	},
});
