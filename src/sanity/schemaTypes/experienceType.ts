import { BriefcaseBusiness } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const experienceType = defineType({
	name: "experience",
	title: "Experience",
	type: "document",
	icon: BriefcaseBusiness,
	fields: [
		defineField({
			name: "company",
			title: "Company",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role",
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
			name: "points",
			title: "Points",
			type: "array",
			of: [
				defineArrayMember({
					type: "string",
				}),
			],
		}),
		defineField({
			name: "icon",
			title: "Icon",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "subExperiences",
			title: "Sub Experiences",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "experience" }],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "company",
			subtitle: "role",
		},
	},
	initialValue: {
		startDate: new Date().toISOString().split("T")[0],
		endDate: new Date().toISOString().split("T")[0],
	},
});
