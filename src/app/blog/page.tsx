"use client";

import { Metadata } from "next";
import React from "react";

import Categories from "@/components/blog/Categories";
import PostCard from "@/components/blog/PostCard";
import PostWidget from "@/components/blog/PostWidget";
import Navbar from "@/components/Navbar";
import getPosts, { PostResult } from "@/lib/requests/getPosts";

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Blog",
		description: "A collection of blog posts",
	};
}

export default function Home(): React.JSX.Element {
	const [posts, setPosts] = React.useState<PostResult[] | undefined>(undefined);
	React.useEffect(() => {
		void getPosts().then((res) => setPosts(res));
	}, []);
	return (
		<div className="relative z-0">
			<Navbar />
			<div className="container mx-auto my-20 px-4 sm:px-10">
				<div className="grid grid-cols-1 sm:gap-12 lg:grid-cols-12">
					<div className="col-span-1 lg:col-span-8">
						{posts
							? posts.map((post) => <PostCard key={post.slug} post={post} />)
							: Array(3)
									.fill(0)
									.map((_, index) => <PostCard key={index} />)}
					</div>
					<div className="col-span-1 lg:col-span-4">
						<div className="relative top-20 lg:sticky">
							<PostWidget />
							<Categories />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
