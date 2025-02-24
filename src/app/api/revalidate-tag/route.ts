import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

interface WebhookPayload {
	_type: string;
}

export async function POST(req: NextRequest): Promise<Response> {
	try {
		if (!process.env.SANITY_REVALIDATE_SECRET) {
			return new Response("Missing environment variable SANITY_REVALIDATE_SECRET", { status: 500 });
		}

		const { isValidSignature, body } = await parseBody<WebhookPayload>(req, process.env.SANITY_REVALIDATE_SECRET);

		if (!isValidSignature) {
			const message = "Invalid signature";
			return new Response(JSON.stringify({ message, isValidSignature, body }), { status: 401 });
		} else if (!body?._type) {
			const message = "Bad Request";
			return new Response(JSON.stringify({ message, body }), { status: 400 });
		}

		// If the `_type` is `post`, then all `client.fetch` calls with
		// `{next: {tags: ['post']}}` will be revalidated
		revalidateTag(body._type);

		return NextResponse.json({ body });
	} catch (err) {
		console.error(err);
		return new Response("Internal Server Error", { status: 500 });
	}
}
