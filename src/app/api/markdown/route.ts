import { NextResponse } from "next/server";
import { Octokit } from "octokit";

interface MarkdownProps {
	text: string;
}

async function handler(req: Request): Promise<NextResponse> {
	try {
		const body = (await req.json()) as MarkdownProps;
		const octokit = new Octokit({ auth: String(process.env.GITHUB_TOKEN) });
		const response = await octokit.request("POST /markdown", {
			text: body.text,
			mode: "markdown",
		});
		return new NextResponse(
			JSON.stringify({ message: "Markdown parsed successfully!", statusCode: 200, result: response.data }),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log(error);
		return new NextResponse(JSON.stringify({ message: "An internal error occured!", statusCode: 500 }), {
			status: 500,
		});
	}
}

export { handler as POST };
