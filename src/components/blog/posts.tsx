import { getImageDimensions } from "@sanity/asset-utils";
import { formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";
import Image from "next/image";
import React from "react";

import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { POSTS_QUERYResult } from "@/sanity/sanity.types";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
		<article className="bg-card/40 transform-gpu overflow-hidden rounded-lg [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]">
			<Image
				src={urlFor(post.mainImage).url() || ""}
				alt={post.mainImage.alt || "Image"}
				placeholder="blur"
				blurDataURL={urlFor(post.mainImage).width(16).height(9).dpr(2).blur(20).url() || ""}
				width={getImageDimensions(post.mainImage.asset?._ref ?? "").width}
				height={getImageDimensions(post.mainImage.asset?._ref ?? "").height}
				className="h-96 max-h-96 w-full rounded-lg object-cover transition-transform duration-300 ease-in-out hover:translate-y-[-1px] hover:scale-[1.05]"
				sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
			/>
			<div className="p-4">
				<div className="flex flex-row justify-between gap-4">
					<div className="flex flex-row items-center gap-2">
						<Avatar className="h-14 w-14 rounded-full">
							<AvatarImage
								src={urlFor(post.author.image).width(56).height(56).url()}
								alt={post.author.name}
							/>
							<AvatarFallback>
								{post.author.name
									.split(" ")
									.map((word) => word[0])
									.join("")
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-1">
							<h2 className="text-lg font-semibold">{post.title}</h2>
							<div className="flex flex-row gap-2">
								{post.categories.slice(0, 2).map((category) => (
									<span
										key={category.slug.current}
										className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
										{category.title}
									</span>
								))}
							</div>
						</div>
					</div>
					<div className="flex flex-row">
						<p className="text-muted-foreground text-sm">
							{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
						</p>
						<Calendar className="ml-2 h-5 w-5" />
					</div>
				</div>
			</div>
		</article>
	);
}

export async function PostList({ query, tags }: PostListProps): Promise<React.ReactElement> {
	const posts = await sanityFetch({
		query: POSTS_QUERY,
		params: { search: query, tags },
		tags: ["post", "author", "category"],
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
