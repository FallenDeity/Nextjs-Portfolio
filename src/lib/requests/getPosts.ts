import { gql, request } from "graphql-request";

export interface PostResult {
	author: {
		id: string;
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
	categories: {
		name: string;
		slug: string;
	}[];
}

interface RequestData {
	postsConnection: {
		edges: {
			node: PostResult;
		}[];
	};
}

export default async function getPosts(): Promise<PostResult[]> {
	const query = gql`
		query GetPostDetails() {
			postsConnection {
				edges {
					node {
						author {
							id
							name
							bio
							photo {
								url
							}
						}
						createdAt
						slug
						title
						excerpt
						featuredImage {
							url
						}
						categories {
							name
							slug
						}
					}
				}
			}
		}
	`;
	let success = false;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (!success) {
		try {
			const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query);
			success = true;
			return data.postsConnection.edges.map((edge) => edge.node);
		} catch (error) {
			console.log(error);
		}
	}
	return [];
}

export async function getCategoryPosts(slug: string): Promise<PostResult[]> {
	const query = gql`
		query GetPostDetails($slug: String!) {
			postsConnection(where: { categories_some: { slug: $slug } }) {
				edges {
					node {
						author {
							id
							name
							bio
							photo {
								url
							}
						}
						createdAt
						slug
						title
						excerpt
						featuredImage {
							url
						}
						categories {
							name
							slug
						}
					}
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
			return data.postsConnection.edges.map((edge) => edge.node);
		} catch (error) {
			console.log(error);
		}
	}
	return [];
}
