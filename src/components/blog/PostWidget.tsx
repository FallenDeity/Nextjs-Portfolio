"use client";

import "react-loading-skeleton/dist/skeleton.css";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import getRecentPosts, { RecentPostResult } from "@/lib/requests/getRecentPosts";
import getSimilarPosts, { SimilarPostResult } from "@/lib/requests/getSimilarPosts";

export default function PostWidget({ slug, categories }: { slug?: string; categories?: string[] }): React.JSX.Element {
	const pathname = usePathname();
	const [isRelated, setIsRelated] = React.useState(false);
	const [posts, setPosts] = React.useState<RecentPostResult[] | SimilarPostResult[]>();
	React.useEffect(() => {
		if (pathname.includes("post") && slug && categories) {
			setIsRelated(true);
			void getSimilarPosts(slug, categories).then((res) => setPosts(res));
		} else {
			setIsRelated(false);
			void getRecentPosts().then((res) => setPosts(res));
		}
	}, [pathname]);
	return (
		<div className="mb-8 rounded-lg bg-[#0e0a1f] p-8 pb-6 shadow-[0px_15px_30px_-15px_#211e35]">
			<h2 className="mb-6 border-b pb-4 text-xl font-semibold">{isRelated ? "Related Posts" : "Recent Posts"}</h2>
			<div className="flex flex-col gap-2">
				{posts ? (
					posts.map((post, index) => (
						<Link
							href={`/post/${post.slug}`}
							key={index}
							className="flex w-full cursor-pointer items-center rounded-md p-2 transition-all duration-500 ease-linear hover:bg-white-100 hover:bg-opacity-5">
							<div className="w-16 flex-none">
								<Image
									alt={post.title}
									height={60}
									width={60}
									className="h-12 w-12 rounded-full object-cover align-middle"
									src={post.featuredImage.url}
								/>
							</div>
							<div className="ml-4 flex-grow">
								<p className="font-xs text-gray-500">{moment(post.createdAt).format("MMM DD, YYYY")}</p>
								<span className="text-md">{post.title}</span>
							</div>
						</Link>
					))
				) : (
					<div className="flex flex-col">
						<SkeletonTheme baseColor="#1f1a2e" highlightColor="#211e35">
							{Array(3)
								.fill(0)
								.map((_, index) => (
									<div
										className="flex w-full cursor-pointer items-center rounded-md p-2 transition-all duration-500 ease-linear hover:bg-white-100 hover:bg-opacity-5"
										key={index}>
										<div className="w-16 flex-none">
											<Skeleton circle={true} height={60} width={60} />
										</div>
										<div className="ml-4 flex-grow">
											<Skeleton height={20} width={80} />
											<Skeleton height={20} width={130} />
										</div>
									</div>
								))}
						</SkeletonTheme>
					</div>
				)}
			</div>
		</div>
	);
}
