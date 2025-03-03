import React from "react";

import { sanityFetch } from "@/sanity/lib/client";
import { POST_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const posts = await sanityFetch({
		query: POSTS_QUERY,
		params: { search: "", tags: [] },
		revalidate: false,
	});

	const slugs = posts.map((post) => post.slug?.current || "").filter((slug) => slug);

	return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }): Promise<React.ReactElement> {
	const { slug } = await params;
	const post = await sanityFetch({
		query: POST_QUERY,
		params: { slug: slug },
		tags: [`post:${slug}`, "author", "category"],
	});

	if (!post) {
		return <div>Post not found</div>;
	}

	return <div>{JSON.stringify(post)}</div>;
}
