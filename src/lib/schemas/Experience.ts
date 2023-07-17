export default {
	name: "experience",
	title: "Experience",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Title",
			type: "string",
		},
		{
			name: "company_name",
			title: "Company Name",
			type: "string",
		},
		{
			name: "icon",
			title: "Icon",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "iconBg",
			title: "Icon Background",
			type: "string",
		},
		{
			name: "date",
			title: "Date",
			type: "string",
		},
		{
			name: "points",
			title: "Points",
			type: "array",
			of: [
				{
					type: "string",
				},
			],
		},
	],
};
