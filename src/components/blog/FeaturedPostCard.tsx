import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { FeaturedPostResult } from "@/lib/requests/getFeaturedPosts";

export default function FeaturedPostCard({ post }: { post: FeaturedPostResult }): React.JSX.Element {
	return (
		<div className="relative h-72">
			<div
				className="absolute inline-block h-72 w-full rounded-lg bg-cover bg-center bg-no-repeat shadow-md"
				style={{ backgroundImage: `url('${post.featuredImage.url}')` }}
			/>
			<div className="to-black absolute h-72 w-full rounded-lg bg-gradient-to-b from-gray-400 via-gray-700 bg-center opacity-50" />
			<div className="absolute flex h-full w-full flex-col items-center justify-center rounded-lg p-4">
				<p className="text-white text-shadow mb-4 text-xs font-semibold">
					{moment(post.createdAt).format("MMM DD, YYYY")}
				</p>
				<p className="text-white text-shadow mb-4 text-center text-2xl font-semibold">{post.title}</p>
				<div className="absolute bottom-5 flex w-full items-center justify-center">
					<Image
						alt={post.author.name}
						height={30}
						width={30}
						className="rounded-full align-middle drop-shadow-lg"
						src={post.author.photo.url}
					/>
					<p className="text-white text-shadow ml-2 inline align-middle font-medium">{post.author.name}</p>
				</div>
			</div>
			<Link href={`/post/${post.slug}`}>
				<span className="absolute h-full w-full cursor-pointer" />
			</Link>
		</div>
	);
}
