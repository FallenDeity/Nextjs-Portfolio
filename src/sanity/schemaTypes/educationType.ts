import { GraduationCap } from "lucide-react";
import { defineField, defineType } from "sanity";

export const educationType = defineType({
	name: "education",
	title: "Education",
	type: "document",
	icon: GraduationCap,
	fields: [
		defineField({
			name: "institution",
			title: "Institution",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "degree",
			title: "Degree",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "startDate",
			title: "Start Date",
			type: "date",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "endDate",
			title: "End Date",
			type: "date",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
		}),
		defineField({
			name: "icon",
			title: "Icon",
			type: "image",
			options: {
				hotspot: true,
			},
			validation: (Rule) => Rule.required(),
		}),
	],
	initialValue: {
		startDate: new Date().toISOString().split("T")[0],
		endDate: new Date().toISOString().split("T")[0],
	},
});
