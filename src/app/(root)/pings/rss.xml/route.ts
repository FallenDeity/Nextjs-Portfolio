import RSS from "rss";

import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PINGS_QUERY } from "@/sanity/lib/queries";

export async function GET(): Promise<Response> {
	const feed = new RSS({
		title: "Pings • Triyan Mukherjee",
		description: "A collection of my thoughts, ideas, and experiences.",
		feed_url: `${process.env.NEXT_PUBLIC_URL}/pings/rss.xml`,
		site_url: process.env.NEXT_PUBLIC_URL ?? "",
		image_url: `${process.env.NEXT_PUBLIC_URL}/pings-open-graph.png`,
		webMaster: "triyanmukherjee@gmail.com (Triyan Mukherjee)",
		managingEditor: "triyanmukherjee@gmail.com (Triyan Mukherjee)",
		copyright: `Copyright © 2025 Triyan Mukherjee`,
		language: "en",
		categories: ["pings", "thoughts", "ideas", "experiences", "blog", "posts", "texts"],
		pubDate: "Sat, 29 Mar 2025 11:52:36 GMT",
	});
	const pings = await sanityFetch({
		query: PINGS_QUERY,
		tags: ["ping", "category"],
	});
	pings.forEach((ping) => {
		feed.item({
			title: ping.title,
			description: ping.body,
			url: `${process.env.NEXT_PUBLIC_URL}/pings#${ping.slug.current}`,
			guid: ping._id,
			date: ping.publishedAt,
			categories: (ping.tags ?? []).map((tag) => tag.title),
			author: "Triyan Mukherjee",
			enclosure: ping.image
				? {
						url: urlFor(ping.image).url(),
						type: "image/jpeg",
					}
				: undefined,
		});
	});
	feed.item({
		title: "Pings",
		description: "A collection of my thoughts, ideas, and experiences.",
		url: `${process.env.NEXT_PUBLIC_URL}/pings`,
		guid: "pings",
		date: "Sat, 29 Mar 2025 11:52:36 GMT",
		categories: ["pings", "thoughts", "ideas", "experiences", "blog", "posts", "texts"],
		enclosure: {
			url: `${process.env.NEXT_PUBLIC_URL}/pings-open-graph.png`,
			type: "image/jpeg",
		},
	});
	return new Response(feed.xml({ indent: true }), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
