import { Suspense } from "react";

import { PostList } from "@/components/blog/posts";
import { PostListSkeleton } from "@/components/blog/posts-skeleton";
import { SearchBar } from "@/components/blog/search";

interface BlogPageProps {
	tags: string[];
	query: string;
}

export default async function BlogPage(props: { searchParams: Promise<BlogPageProps> }): Promise<React.ReactElement> {
	const searchParams = await props.searchParams;
	const query = searchParams.query || "";
	const tags = searchParams.tags || [];

	return (
		<div className="relative grid min-h-screen w-full grid-cols-4 gap-6 p-6">
			<div className="bg-card/40 sticky top-6 col-span-1 h-[600px] w-full transform-gpu rounded-xl [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]" />
			<div className="relative col-span-2 flex flex-col gap-6">
				<SearchBar />
				<Suspense fallback={<PostListSkeleton />}>
					<PostList query={query} tags={tags} />
				</Suspense>
			</div>
			<div className="bg-card/40 sticky top-6 col-span-1 h-[400px] w-full transform-gpu rounded-xl [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]" />
		</div>
	);
}
