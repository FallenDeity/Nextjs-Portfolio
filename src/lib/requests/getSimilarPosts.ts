import { gql, request } from "graphql-request";

export interface SimilarPostResult {
	title: string;
	featuredImage: {
		url: string;
	};
	createdAt: string;
	slug: string;
}

interface RequestData {
	posts: SimilarPostResult[];
}

export default async function getSimilarPosts(slug: string, categories: string[]): Promise<SimilarPostResult[]> {
	const query = gql`
		query GetPostDetails($slug: String!, $category: [String!]) {
			posts(
				where: { slug_not: $slug, AND: { categories_some: { slug_in: $category } } }
				orderBy: createdAt_ASC
				last: 3
			) {
				title
				featuredImage {
					url
				}
				createdAt
				slug
			}
		}
	`;
	try {
		const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query, {
			slug,
			category: categories,
		});
		return data.posts;
	} catch (error) {
		console.log(error);
		return [];
	}
}
