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
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
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
		}),
		defineField({
			name: "publishedAt",
			title: "Published At",
			type: "datetime",
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
		}),
	],
	initialValue: {
		publishedAt: new Date().toISOString(),
	},
});
