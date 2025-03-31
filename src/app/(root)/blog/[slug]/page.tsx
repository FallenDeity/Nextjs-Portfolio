import "@/styles/blog.css";

import { getImageDimensions } from "@sanity/asset-utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import Comments from "@/components/blog/comments";
import { CustomMDX } from "@/components/mdx/mdx-remote";
import { CARD_STYLE_STRING, cn, formatDate } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERY, POSTS_QUERY, PREV_NEXT_POSTS_QUERY } from "@/sanity/lib/queries";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const post = await sanityFetch({
		query: POST_QUERY,
		params: { slug: slug },
		tags: [`post:${slug}`, "author", "category"],
	});

	if (!post) {
		return {
			title: "Post not found",
			description: "The requested post could not be found.",
			keywords: ["404", "not found", "error"],
		};
	}

	return {
		title: post.title,
		description: post.excerpt,
		keywords: [post.title, ...post.categories.map((category) => category.slug.current), "blog", "article"],
		publisher: post.author.name,
		openGraph: {
			siteName: "Triyan Mukherjee",
			type: "article",
			title: post.title,
			description: post.excerpt,
			tags: post.categories.map((category) => category.slug.current),
			url: `/blog/${post.slug.current}`,
			images: [
				{
					url: urlFor(post.mainImage).url() || "",
					alt: post.mainImage.alt || "Image",
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.excerpt,
			creator: post.author.name,
			site: "/",
			images: [
				{
					url: urlFor(post.mainImage).url() || "",
					alt: post.mainImage.alt || "Image",
					width: 1200,
					height: 630,
				},
			],
		},
	};
}

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
	const next_prev = await sanityFetch({
		query: PREV_NEXT_POSTS_QUERY,
		params: { slug: slug },
		tags: [`post:${slug}`, "author", "category"],
	});
	const calculatePostReadTime = (body: string): number => {
		const wordsPerMinute = 200;
		const textLength = body.split(" ").length;
		return Math.ceil(textLength / wordsPerMinute);
	};
	const repo = (process.env.COMMENTS_REPO || "") as `${string}/${string}`;
	const repoId = process.env.COMMENTS_REPO_ID || "";
	const category = process.env.COMMENTS_CATEGORY || "";
	const categoryId = process.env.COMMENTS_CATEGORY_ID || "";

	if (!post) {
		return redirect("/404");
	}
	return (
		<>
			<article
				className={cn(
					"mx-auto min-h-screen w-full max-w-3xl overflow-hidden md:m-6 md:rounded-lg",
					CARD_STYLE_STRING
				)}>
				<Image
					priority
					className="max-h-96 w-full rounded-b-lg object-cover md:rounded-lg"
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
							<p className="text-muted-foreground text-sm">
								{post.author.name} <span className="text-muted-foreground/50">&bull;</span>{" "}
								{calculatePostReadTime(post.body)} min read
							</p>
						</div>
					</div>
					<div className="flex flex-col items-end gap-4">
						<p className="text-muted-foreground text-sm">{formatDate(post.publishedAt, true)}</p>
						<div className="hidden flex-row gap-2 md:flex">
							{post.categories.map((category) => (
								<span
									key={category.slug.current}
									className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs lowercase">
									#{category.slug.current}
								</span>
							))}
						</div>
					</div>
				</section>
				<section className="flex w-full flex-row items-center justify-center px-4 pb-4 md:hidden">
					<div className="flex flex-row gap-2">
						{post.categories.map((category) => (
							<span
								key={category.slug.current}
								className="text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 font-mono text-xs lowercase">
								#{category.slug.current}
							</span>
						))}
					</div>
				</section>
				<div className="markdown-body p-4">
					<CustomMDX source={post.body} addToc={true} />
				</div>
			</article>
			<div
				className={`mx-auto mt-6 flex w-full max-w-3xl flex-col gap-6 md:mt-0 md:justify-between ${next_prev && !next_prev.prev ? "md:flex-row-reverse" : "md:flex-row"}`}>
				{next_prev && next_prev.prev && (
					<Link
						aria-label="View previous post"
						href={`/blog/${next_prev.prev.slug.current}`}
						className={cn("flex w-full justify-start rounded-lg p-4 md:w-1/2", CARD_STYLE_STRING)}>
						<div className="flex w-full flex-row items-center justify-between gap-2">
							<ArrowLeft className="h-6 w-6" />
							<div className="flex w-full flex-col items-end">
								<p>{next_prev.prev.title}</p>
								<p className="text-muted-foreground line-clamp-1 max-w-4/5 text-xs text-ellipsis">
									{next_prev.prev.excerpt}
								</p>
							</div>
						</div>
					</Link>
				)}
				{next_prev && next_prev.next && (
					<Link
						aria-label="View next post"
						href={`/blog/${next_prev.next.slug.current}`}
						className={cn("flex w-full justify-end rounded-lg p-4 md:w-1/2", CARD_STYLE_STRING)}>
						<div className="flex w-full flex-row items-center justify-between gap-2">
							<div className="flex w-full flex-col items-start">
								<p>{next_prev.next.title}</p>
								<p className="text-muted-foreground line-clamp-1 max-w-4/5 text-xs text-ellipsis">
									{next_prev.next.excerpt}
								</p>
							</div>
							<ArrowRight className="h-6 w-6" />
						</div>
					</Link>
				)}
			</div>
			<section className="z-10 mx-auto mt-16 mb-44 w-full max-w-3xl md:mb-36">
				<Comments repo={repo} repoId={repoId} category={category} categoryId={categoryId} />
			</section>
		</>
	);
}
