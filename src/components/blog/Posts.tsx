"use client";

import React from "react";

import PostCard from "@/components/blog/PostCard";
import getPosts, { getCategoryPosts, PostResult } from "@/lib/requests/getPosts";

export default function Posts({ slug = "" }: { slug?: string }): React.JSX.Element {
	const [posts, setPosts] = React.useState<PostResult[] | undefined>(undefined);
	React.useEffect(() => {
		slug
			? void getCategoryPosts(slug).then((posts) => setPosts(posts))
			: void getPosts().then((posts) => setPosts(posts));
	}, []);
	return (
		<>
			{posts
				? posts.map((post) => <PostCard key={post.slug} post={post} />)
				: Array(3)
						.fill(0)
						.map((_, index) => <PostCard key={index} />)}
		</>
	);
}
