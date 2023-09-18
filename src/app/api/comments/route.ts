import { gql, GraphQLClient } from "graphql-request";
import { NextResponse } from "next/server";

import { ApiComment } from "@/lib/requests/Comments";

const URL = String(process.env.NEXT_PUBLIC_GRAPHQL_URL);

async function handler(req: Request): Promise<NextResponse> {
	try {
		const body = (await req.json()) as ApiComment;
		const client = new GraphQLClient(URL, {
			headers: {
				authorization: `Bearer ${String(process.env.GRAPHQL_TOKEN)}`,
			},
		});
		const query = gql`
			mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
				createComment(
					data: { name: $name, email: $email, comment: $comment, post: { connect: { slug: $slug } } }
				) {
					id
				}
			}
		`;
		const result = await client.request(query, { ...body });
		return new NextResponse(JSON.stringify({ message: "Posted comment successfully!", statusCode: 200, result }), {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new NextResponse(JSON.stringify({ message: "An internal error occured!", statusCode: 500 }), {
			status: 500,
		});
	}
}

export { handler as POST };
