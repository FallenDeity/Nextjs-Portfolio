import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { CARD_STYLE_STRING, cn, formatDate } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { CATEGORIES_QUERY, RECENT_POSTS_QUERY } from "@/sanity/lib/queries";

import Categories from "./categories";

export async function RecentPosts(): Promise<React.ReactElement> {
	const recentPosts = await sanityFetch({
		query: RECENT_POSTS_QUERY,
		params: { limit: 5 },
		tags: ["post"],
	});

	const categories = await sanityFetch({
		query: CATEGORIES_QUERY,
		tags: ["category"],
	});

	return (
		<div className="sticky top-6 col-span-1 h-fit w-full">
			<div className={cn("flex flex-col gap-2 rounded-xl py-4", CARD_STYLE_STRING)}>
				<h3 className="mb-2 px-4 text-xl font-semibold">Recent Posts</h3>
				<span className="border-muted-foreground/20 mx-4 border-t" />
				<div className="flex flex-col gap-1 px-2">
					{recentPosts.map((post) => (
						<Link
							aria-label={`Read ${post.title}`}
							key={post._id}
							href={`/blog/${post.slug.current}`}
							className="hover:bg-primary/10 flex flex-row items-center gap-4 rounded-md p-2 transition-all duration-300 ease-in-out">
							<Image
								src={urlFor(post.mainImage).url() || ""}
								alt={post.mainImage.alt || "Image"}
								width={56}
								height={56}
								className="h-14 w-14 rounded-md object-cover"
							/>
							<div className="flex w-full flex-col">
								<div className="flex w-full flex-row items-center gap-1 text-[10px]">
									<p className="text-muted-foreground">{formatDate(post.publishedAt, true)}</p>
									<span className="text-muted-foreground text-xs">&bull;</span>
									<p className="text-muted-foreground">
										{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
									</p>
								</div>
								<h4 className="text-md font-semibold">{post.title}</h4>
								<p className="text-muted-foreground line-clamp-1 text-xs text-ellipsis">
									{post.excerpt}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
			<Categories categories={categories} />
		</div>
	);
}
