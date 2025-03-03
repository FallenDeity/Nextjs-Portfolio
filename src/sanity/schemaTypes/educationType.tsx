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
		}),
		defineField({
			name: "degree",
			title: "Degree",
			type: "string",
		}),
		defineField({
			name: "startDate",
			title: "Start Date",
			type: "date",
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
		}),
	],
	initialValue: {
		startDate: new Date().toISOString(),
		endDate: new Date().toISOString(),
	},
});
