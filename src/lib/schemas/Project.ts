export default {
	name: "project",
	title: "Project",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "description",
			title: "Description",
			type: "text",
		},
		{
			name: "tags",
			title: "Tags",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "tag",
							title: "Tag",
							type: "string",
						},
						{
							name: "color",
							title: "Color",
							type: "string",
						},
					],
				},
			],
		},
		{
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "link",
			title: "Link",
			type: "string",
		},
		{
			name: "source_code_link",
			title: "Source Code Link",
			type: "string",
		},
	],
};
