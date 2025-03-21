import "@/styles/blog.css";

import { getImageDimensions } from "@sanity/asset-utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

import { CustomMDX } from "@/components/mdx/mdx-remote";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const posts = await sanityFetch({
		query: POSTS_QUERY,
		params: { search: "", tags: [] },
		revalidate: false,
	});

	const slugs = posts.map((post) => post.slug?.current || "").filter((slug) => slug);

	return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }): Promise<React.ReactElement> {
	const { slug } = await params;
	const post = await sanityFetch({
		query: POST_QUERY,
		params: { slug: slug },
		tags: [`post:${slug}`, "author", "category"],
	});

	if (!post) {
		return redirect("/404");
	}
	return (
		<article className="bg-card/40 m-6 mx-auto mb-36 min-h-screen max-w-3xl transform-gpu overflow-hidden rounded-lg [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]">
			<Image
				priority
				className="h-96 max-h-96 w-full rounded-lg object-cover"
				src={urlFor(post.mainImage).url() || ""}
				alt={post.mainImage.alt || "Image"}
				width={getImageDimensions(post.mainImage.asset?._ref ?? "").width}
				height={getImageDimensions(post.mainImage.asset?._ref ?? "").height}
			/>
			<section className="flex flex-row items-start justify-between p-4">
				<div className="flex flex-row items-center gap-2">
					<Image
						src={urlFor(post.author.image).width(56).height(56).url() || ""}
						alt={post.author.name}
						width={56}
						height={56}
						className="h-14 w-14 rounded-full"
					/>
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl font-bold">{post.title}</h1>
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
				</div>
			</section>
			<div className="p-4">
				<CustomMDX source={post.body} />
			</div>
		</article>
	);
}
