"use client";

import React from "react";

import getAdjacentPosts, { AdjacentPostResult } from "@/lib/requests/getAdjacentPosts";

import AdjacentPostCard from "./AdjacentPostCard";

export default function AdjacentPosts({ createdAt, slug }: { createdAt: string; slug: string }): React.JSX.Element {
	const [adjacentPost, setAdjacentPost] = React.useState<AdjacentPostResult>();
	React.useEffect(() => {
		void getAdjacentPosts(createdAt, slug).then((posts) => setAdjacentPost(posts));
	}, []);
	return (
		<div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-8">
			{adjacentPost && (
				<>
					{adjacentPost.previous && (
						<div
							className={`${
								adjacentPost.next ? "col-span-1 lg:col-span-4" : "col-span-1 lg:col-span-8"
							} adjacent-post relative h-72 rounded-lg`}>
							<AdjacentPostCard post={adjacentPost.previous} position="LEFT" />
						</div>
					)}
					{adjacentPost.next && (
						<div
							className={`${
								adjacentPost.previous ? "col-span-1 lg:col-span-4" : "col-span-1 lg:col-span-8"
							} adjacent-post relative h-72 rounded-lg`}>
							<AdjacentPostCard post={adjacentPost.next} position="RIGHT" />
						</div>
					)}
				</>
			)}
		</div>
	);
}
