import { FlaskConical } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
	name: "project",
	title: "Project",
	type: "document",
	icon: FlaskConical,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "category" }],
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "source",
			title: "Source",
			type: "url",
		}),
		defineField({
			name: "demo",
			title: "Demo",
			type: "url",
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
			validation: (Rule) => Rule.required(),
		}),
	],
	initialValue: {
		publishedAt: new Date().toISOString(),
	},
});
