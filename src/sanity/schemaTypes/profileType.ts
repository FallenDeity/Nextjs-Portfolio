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
		}),
		defineField({
			name: "caption",
			title: "Caption",
			type: "string",
		}),
		defineField({
			name: "bio",
			title: "Bio",
			type: "text",
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
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
		}),
		defineField({
			name: "resume",
			title: "Resume",
			type: "file",
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
				}),
				defineField({
					name: "email",
					title: "Email",
					type: "string",
				}),
			],
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
	],
});
