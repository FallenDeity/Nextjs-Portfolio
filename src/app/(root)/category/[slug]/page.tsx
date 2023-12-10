import { Metadata } from "next";
import React from "react";

import Categories from "@/components/blog/Categories";
import Posts from "@/components/blog/Posts";
import PostWidget from "@/components/blog/PostWidget";
import Navbar from "@/components/Navbar";
import { meta } from "@/lib/utils";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
	const metadata = meta;
	metadata.title = `Blog - ${params.slug}`;
	metadata.openGraph.title = `Blog - ${params.slug}`;
	metadata.description =
		"Welcome to my blog page! Dive into a collection of insightful articles and captivating stories where I share my thoughts, experiences, and expertise on various topics.";
	metadata.openGraph.description =
		"Welcome to my blog page! Dive into a collection of insightful articles and captivating stories where I share my thoughts, experiences, and expertise on various topics.";
	metadata.openGraph.images = "/og.png";
	return metadata;
}

export default function Page({ params }: { params: { slug: string } }): React.JSX.Element {
	return (
		<div className="relative z-0">
			<Navbar />
			<div className="container mx-auto my-20 px-4 sm:px-10">
				<div className="grid grid-cols-1 sm:gap-12 lg:grid-cols-12">
					<div className="col-span-1 lg:col-span-8">
						<Posts slug={params.slug} />
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
