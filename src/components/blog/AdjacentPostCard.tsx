import moment from "moment";
import Link from "next/link";
import React from "react";

import { AdjacentPosts } from "@/lib/requests/getAdjacentPosts";

export default function AdjacentPostCard({
	post,
	position,
}: {
	post: AdjacentPosts;
	position: "LEFT" | "RIGHT";
}): React.JSX.Element {
	return (
		<>
			<div
				className="absolute inline-block h-72 w-full rounded-lg bg-cover bg-center bg-no-repeat shadow-md"
				style={{ backgroundImage: `url('${post.featuredImage.url}')` }}
			/>
			<div className="to-black absolute h-72 w-full rounded-lg bg-gradient-to-b from-gray-400 via-gray-700 bg-center opacity-50" />
			<div className="absolute flex h-full w-full flex-col items-center justify-center rounded-lg p-4">
				<p className="text-white text-shadow text-xs font-semibold">
					{moment(post.createdAt).format("MMM DD, YYYY")}
				</p>
				<p className="text-white text-shadow text-center text-2xl font-semibold">{post.title}</p>
			</div>
			<Link href={`/post/${post.slug}`}>
				<span className="absolute z-10 h-full w-full cursor-pointer" />
			</Link>
			{position === "LEFT" && (
				<div className="absolute bottom-5 left-4 flex w-[50px] cursor-pointer items-center justify-center rounded-full bg-pink-600 py-3 text-center transition-all duration-300 ease-in-out">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="text-white h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
				</div>
			)}
			{position === "RIGHT" && (
				<div className="absolute bottom-5 right-4 flex w-[50px] cursor-pointer items-center justify-center rounded-full bg-pink-600 py-3 text-center transition-all duration-300 ease-in-out">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="text-white h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</div>
			)}
		</>
	);
}
