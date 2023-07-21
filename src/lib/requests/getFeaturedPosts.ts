import { gql, request } from "graphql-request";

export interface FeaturedPostResult {
	title: string;
	author: {
		name: string;
		photo: {
			url: string;
		};
	};
	featuredImage: {
		url: string;
	};
	createdAt: string;
	slug: string;
}

interface RequestData {
	posts: FeaturedPostResult[];
}

export async function getFeaturedPosts(): Promise<FeaturedPostResult[]> {
	const query = gql`
		query GetPostDetails() {
            posts(where: {featuredPost: true}) {
                author {
                  name
                  photo {
                    url
                  }
                }
                featuredImage {
                  url
                }
                title
                slug
                createdAt
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
