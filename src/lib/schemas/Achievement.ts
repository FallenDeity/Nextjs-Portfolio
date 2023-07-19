export default {
	name: "achievement",
	title: "Achievement",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
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
			name: "description",
			title: "Description",
			type: "text",
		},
		{
			name: "link",
			title: "Link",
			type: "url",
		},
	],
};
