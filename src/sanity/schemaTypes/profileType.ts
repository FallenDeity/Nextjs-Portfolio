import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const profileType = defineType({
	name: "profile",
	title: "Profile",
	type: "document",
	icon: UserIcon,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "caption",
			title: "Caption",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "bio",
			title: "Bio",
			type: "text",
			validation: (Rule) => Rule.required(),
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
		defineField({
			name: "languages",
			title: "Languages",
			type: "array",
			of: [
				defineArrayMember({
					type: "string",
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "resume",
			title: "Resume",
			type: "file",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "contact",
			title: "Contact",
			type: "object",
			fields: [
				defineField({
					name: "discord",
					title: "Discord",
					type: "url",
				}),
				defineField({
					name: "linkedin",
					title: "LinkedIn",
					type: "url",
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: "email",
					title: "Email",
					type: "string",
					validation: (Rule) => Rule.required(),
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "education",
			title: "Education",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "education" }],
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "experience",
			title: "Experience",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "experience" }],
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "projects",
			title: "Projects",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "project" }],
				}),
			],
			validation: (Rule) => Rule.required(),
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
			validation: (Rule) => Rule.required(),
		}),
	],
});
