import { Metadata } from "next";
import React from "react";

import Categories from "@/components/blog/Categories";
import Posts from "@/components/blog/Posts";
import PostWidget from "@/components/blog/PostWidget";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
	title: "Blog",
	description: "A collection of blog posts",
};

export default function Blog(): React.JSX.Element {
	return (
		<div className="relative z-0">
			<Navbar />
			<div className="container mx-auto my-20 px-4 sm:px-10">
				<div className="grid grid-cols-1 sm:gap-12 lg:grid-cols-12">
					<div className="col-span-1 lg:col-span-8">
						<Posts />
					</div>
					<div className="col-span-1 lg:col-span-4">
						<div className="relative top-20 lg:sticky">
							<PostWidget />
							<Categories />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
