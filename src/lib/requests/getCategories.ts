import { gql, request } from "graphql-request";

export interface CategoryResult {
	name: string;
	slug: string;
}

interface RequestData {
	categories: CategoryResult[];
}

export default async function getCategories(): Promise<CategoryResult[]> {
	const query = gql`
		query getCategories() {
            categories {
                name
                slug
            }
        }
    `;
	try {
		const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query);
		return data.categories;
	} catch (error) {
		console.log(error);
		return [];
	}
}
