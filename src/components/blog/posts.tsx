import { PortableText } from "@portabletext/react";
import React from "react";

import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { POSTS_QUERYResult } from "@/sanity/sanity.types";

type Post = POSTS_QUERYResult[number];

interface PostListProps {
	query: string;
	tags: string[];
}

interface PostCardProps {
	post: Post;
}

function PostCard({ post }: PostCardProps): React.ReactElement {
	return (
		<article className="bg-card/40 transform-gpu rounded-xl p-4 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]">
			<h2>{post.title}</h2>
			<time>{post.publishedAt}</time>
			{post.body && <PortableText value={post.body} />}
		</article>
	);
}

export async function PostList({ query, tags }: PostListProps): Promise<React.ReactElement> {
	const posts = await sanityFetch({
		query: POSTS_QUERY,
		params: { search: query, tags },
	});

	return (
		<ul className="flex h-full w-full flex-1 flex-col gap-10">
			{posts.map((post) => (
				<li key={post._id}>
					<PostCard post={post} />
				</li>
			))}
		</ul>
	);
}
