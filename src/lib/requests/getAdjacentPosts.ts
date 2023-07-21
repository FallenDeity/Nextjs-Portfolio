import { gql, request } from "graphql-request";

export interface AdjacentPosts {
	title: string;
	featuredImage: {
		url: string;
	};
	createdAt: string;
	slug: string;
}

interface RequestData {
	next: AdjacentPosts[];
	previous: AdjacentPosts[];
}

export interface AdjacentPostResult {
	next: AdjacentPosts | null;
	previous: AdjacentPosts | null;
}

export default async function getAdjacentPosts(createdAt: string, slug: string): Promise<AdjacentPostResult> {
	const query = gql`
		query GetAdjacentPosts($createdAt: DateTime!, $slug: String!) {
			next: posts(
				first: 1
				orderBy: createdAt_ASC
				where: { slug_not: $slug, AND: { createdAt_gte: $createdAt } }
			) {
				title
				featuredImage {
					url
				}
				createdAt
				slug
			}
			previous: posts(
				first: 1
				orderBy: createdAt_DESC
				where: { slug_not: $slug, AND: { createdAt_lte: $createdAt } }
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
	let success = false;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (!success) {
		try {
			const result = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query, {
				slug,
				createdAt,
			});
			success = true;
			return { next: result.next[0], previous: result.previous[0] };
		} catch (error) {
			console.log(error);
		}
	}
	return { next: null, previous: null };
}
