import { PortableText } from "@portabletext/react";
import React from "react";

import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { POSTS_QUERYResult } from "@/sanity/sanity.types";

type Post = POSTS_QUERYResult[number];

function PostCard({ post }: { post: Post }): React.ReactElement {
	if (!post.body) return <></>;
	return (
		<article className="bg-card/40 rounded-md p-4">
			<h2>{post.title}</h2>
			<time>{post.publishedAt}</time>
			<PortableText value={post.body} />
		</article>
	);
}

export default async function BlogPage(): Promise<React.ReactElement> {
	const posts = await sanityFetch({
		query: POSTS_QUERY,
	});
	console.log(JSON.stringify(posts, null, 2));
	return (
		<div>
			<h1>Blog</h1>
			<ul>
				{posts.map((post) => (
					<li key={post._id}>
						<PostCard post={post} />
					</li>
				))}
			</ul>
		</div>
	);
}
