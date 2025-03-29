import RSS from "rss";

import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export async function GET(): Promise<Response> {
	const feed = new RSS({
		title: "Blog • Triyan Mukherjee",
		description:
			"Dive into a collection of insightful articles and captivating stories where I share my thoughts, experiences, and expertise on various topics.",
		feed_url: `${process.env.NEXT_PUBLIC_URL}/blog/rss.xml`,
		site_url: process.env.NEXT_PUBLIC_URL ?? "",
		image_url: `${process.env.NEXT_PUBLIC_URL}/blog-open-graph.png`,
		webMaster: "triyanmukherjee@gmail.com (Triyan Mukherjee)",
		managingEditor: "triyanmukherjee@gmail.com (Triyan Mukherjee)",
		copyright: `Copyright © 2025 Triyan Mukherjee`,
		language: "en",
		categories: ["blog", "thoughts", "texts", "technical", "tutorials", "posts", "philosophy", "experiences"],
		pubDate: "Sat, 29 Mar 2025 11:52:36 GMT",
	});
	const posts = await sanityFetch({
		query: POSTS_QUERY,
		params: { search: "", tags: [] },
		tags: ["post", "author", "category"],
	});
	posts.forEach((post) => {
		feed.item({
			title: post.title,
			description: post.excerpt,
			url: `${process.env.NEXT_PUBLIC_URL}/blog/${post.slug.current}`,
			guid: post._id,
			date: post.publishedAt,
			categories: (post.categories ?? []).map((category) => category.title),
			author: post.author.name,
			enclosure: {
				url: urlFor(post.mainImage).url(),
				type: "image/jpeg",
			},
		});
	});
	feed.item({
		title: "Blog",
		description:
			"Dive into a collection of insightful articles and captivating stories where I share my thoughts, experiences, and expertise on various topics.",
		url: `${process.env.NEXT_PUBLIC_URL}/blog`,
		guid: "blog",
		date: "Sat, 29 Mar 2025 11:52:36 GMT",
		categories: ["blog", "thoughts", "texts", "technical", "tutorials", "posts", "philosophy", "experiences"],
		enclosure: {
			url: `${process.env.NEXT_PUBLIC_URL}/blog-open-graph.png`,
			type: "image/jpeg",
		},
	});
	return new Response(feed.xml({ indent: true }), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
