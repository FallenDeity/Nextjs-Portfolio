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
			name: "slug",
			type: "slug",
			options: {
				source: "title",
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
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
			fields: [
				defineField({
					name: "alt",
					type: "string",
					title: "Alternative text",
					validation: (Rule) => Rule.required(),
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "features",
			title: "Features",
			type: "array",
			of: [
				defineArrayMember({
					type: "string",
				}),
			],
		}),
		defineField({
			name: "technologies",
			title: "Technologies",
			type: "array",
			of: [
				defineArrayMember({
					type: "string",
				}),
			],
		}),
		defineField({
			name: "screenshots",
			title: "Screenshots",
			type: "array",
			of: [
				defineArrayMember({
					type: "image",
					options: {
						hotspot: true,
					},
				}),
			],
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
		}),
	],
	initialValue: {
		publishedAt: new Date().toISOString(),
		featured: false,
	},
});
