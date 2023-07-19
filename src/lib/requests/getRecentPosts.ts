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
	try {
		const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query);
		return data.posts;
	} catch (error) {
		console.log(error);
		return [];
	}
}
