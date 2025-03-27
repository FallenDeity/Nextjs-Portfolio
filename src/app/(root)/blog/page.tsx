import { Suspense } from "react";

import { PostList } from "@/components/blog/posts";
import { PostListSkeleton } from "@/components/blog/posts-skeleton";
import { RecentPosts } from "@/components/blog/recent-post";
import { SearchBar } from "@/components/blog/search";
import { sanityFetch } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";

interface BlogPageProps {
	tags: string;
	query: string;
}

export default async function BlogPage(props: { searchParams: Promise<BlogPageProps> }): Promise<React.ReactElement> {
	const searchParams = await props.searchParams;
	const query = searchParams.query || "";
	const tags = searchParams.tags ? searchParams.tags.split(",") : [];

	const categories = await sanityFetch({
		query: CATEGORIES_QUERY,
		tags: ["category"],
	});

	return (
		<div className="relative mb-44 flex min-h-screen w-full flex-col gap-6 p-6 md:mb-36 lg:grid lg:grid-cols-4">
			<div className="col-span-1 hidden lg:flex" />
			<div className="relative col-span-2 flex flex-col gap-6">
				<SearchBar tags={categories} />
				<Suspense fallback={<PostListSkeleton />}>
					<PostList query={query} tags={tags} />
				</Suspense>
			</div>
			<RecentPosts />
		</div>
	);
}
