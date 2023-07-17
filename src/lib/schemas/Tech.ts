export default {
	name: "tech",
	title: "Tech",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
		},
		{
			name: "logo",
			title: "Logo",
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
	],
};
