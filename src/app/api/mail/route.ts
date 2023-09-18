import emailjs from "@emailjs/browser";
import { NextResponse } from "next/server";

interface ContactProps {
	name: string;
	email: string;
	message: string;
}

async function handler(req: Request): Promise<NextResponse> {
	try {
		const body = (await req.json()) as ContactProps;
		emailjs.init(String(process.env.EMAILJS_USER_ID));
		await emailjs.send(
			String(process.env.EMAILJS_SERVICE_ID),
			String(process.env.EMAILJS_TEMPLATE_ID),
			{
				from_name: body.name,
				to_name: "Triyan Mukherjee",
				from_email: body.email,
				to_email: "triyanmukherjee@gmail.com",
				message: body.message,
			},
			String(process.env.EMAILJS_USER_ID)
		);
		return new NextResponse(JSON.stringify({ message: "Email sent successfully!", statusCode: 200 }), {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new NextResponse(JSON.stringify({ message: "Email not sent!", statusCode: 500 }), {
			status: 500,
		});
	}
}

export { handler as POST };
