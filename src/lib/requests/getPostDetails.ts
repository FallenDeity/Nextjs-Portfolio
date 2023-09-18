import { gql, request } from "graphql-request";

export interface PostDetailsResult {
	author: {
		name: string;
		bio: string;
		photo: {
			url: string;
		};
	};
	createdAt: string;
	slug: string;
	title: string;
	excerpt: string;
	featuredImage: {
		url: string;
	};
	content: {
		markdown: string;
		text: string;
		raw: {
			children: {
				type: string;
				children: {
					text: string;
				}[];
			}[];
		};
	};
	categories: {
		name: string;
		slug: string;
	}[];
}

interface RequestData {
	post: PostDetailsResult | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getPostDetails(slug: string): Promise<PostDetailsResult | null> {
	const query = gql`
		query GetPostDetails($slug: String!) {
			post(where: { slug: $slug }) {
				title
				excerpt
				featuredImage {
					url
				}
				author {
					name
					bio
					photo {
						url
					}
				}
				createdAt
				slug
				content {
					markdown
					text
					raw
				}
				categories {
					name
					slug
				}
			}
		}
	`;
	let success = false;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (!success) {
		try {
			const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query, { slug });
			success = true;
			return data.post;
		} catch (error) {
			console.log(error);
		}
	}
	return null;
}
