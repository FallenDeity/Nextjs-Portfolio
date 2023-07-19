import { notFound } from "next/navigation";
import React from "react";

import Author from "@/components/blog/Author";
import Categories from "@/components/blog/Categories";
import CommentForm from "@/components/blog/CommentForm";
import CommentList from "@/components/blog/CommentList";
import PostDetail from "@/components/blog/PostDetail";
import PostWidget from "@/components/blog/PostWidget";
import Navbar from "@/components/Navbar";
import getPostDetails from "@/lib/requests/getPostDetails";

export default async function Page({ params }: { params: { slug: string } }): Promise<React.JSX.Element> {
	const post = await getPostDetails(params.slug);
	if (!post) {
		return notFound();
	}
	return (
		<div className="relative z-0">
			<Navbar />
			<div className="container mx-auto my-20 px-4 sm:px-10">
				<div className="grid grid-cols-1 sm:gap-12 lg:grid-cols-12">
					<div className="col-span-1 lg:col-span-8">
						<PostDetail post={post} />
						<Author author={post.author} />
						<CommentForm />
						<CommentList />
					</div>
					<div className="col-span-1 lg:col-span-4">
						<div className="relative top-20 lg:sticky">
							<PostWidget
								slug={post.slug}
								categories={post.categories.map((category) => category.slug)}
							/>
							<Categories />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
