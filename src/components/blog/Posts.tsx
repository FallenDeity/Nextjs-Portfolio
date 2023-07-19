"use client";

import React from "react";

import PostCard from "@/components/blog/PostCard";
import getPosts, { PostResult } from "@/lib/requests/getPosts";

export default function Posts(): React.JSX.Element {
	const [posts, setPosts] = React.useState<PostResult[] | undefined>(undefined);
	React.useEffect(() => {
		void getPosts().then((res) => setPosts(res));
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
