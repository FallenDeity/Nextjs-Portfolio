import { gql, request } from "graphql-request";

export interface ApiComment {
	name: string;
	email: string;
	comment: string;
	slug: string;
}

export interface CommentResult {
	id: string;
	name: string;
	email: string;
	comment: string;
	createdAt: string;
}

interface RequestData {
	comments: CommentResult[];
}

export async function submitComment(comment: ApiComment): Promise<boolean> {
	try {
		const response = await fetch("/api/comments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(comment),
		});
		return response.ok;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function getComments(slug: string): Promise<CommentResult[]> {
	const query = gql`
		query getComments($slug: String!) {
			comments(where: { post: { slug: $slug } }) {
				comment
				createdAt
				id
				email
				name
			}
		}
	`;
	let success = false;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (!success) {
		try {
			const data = await request<RequestData>(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), query, { slug });
			success = true;
			return data.comments;
		} catch (error) {
			console.log(error);
		}
	}
	return [];
}
