import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
	S.list()
		.title("Portfolio")
		.items([
			S.listItem()
				.title("Profile")
				.child(
					S.list()
						.title("Profile")
						.items([
							S.listItem()
								.title("Profile")
								.child(S.document().schemaType("profile").documentId("profile")),
							S.documentTypeListItem("education").title("Education"),
							S.documentTypeListItem("experience").title("Experience"),
						])
				),
			S.divider(),
			S.listItem()
				.title("Blog")
				.child(
					S.list()
						.title("Blog")
						.items([
							S.documentTypeListItem("post").title("Posts"),
							S.documentTypeListItem("category").title("Categories").id("post_categories"),
							S.documentTypeListItem("author").title("Authors"),
						])
				),
			S.divider(),
			S.listItem()
				.title("Projects")
				.child(
					S.list()
						.title("Projects")
						.items([
							S.documentTypeListItem("project").title("Projects"),
							S.documentTypeListItem("category").title("Categories").id("project_categories"),
						])
				),
		]);
