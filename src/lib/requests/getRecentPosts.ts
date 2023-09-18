import { gql, request } from "graphql-request";

export interface RecentPostResult {
	title: string;
	featuredImage: {
		url: string;
	};
	createdAt: string;
	slug: string;
}

interface RequestData {
	posts: RecentPostResult[];
}

export default async function getRecentPosts(): Promise<RecentPostResult[]> {
	const query = gql`
		query GetPostDetails() {
            posts(
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
	let success = false;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (!success) {
		try {
			const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query);
			success = true;
			return data.posts;
		} catch (error) {
			console.log(error);
		}
	}
	return [];
}
