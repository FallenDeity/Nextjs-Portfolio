import "react-loading-skeleton/dist/skeleton.css";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsCalendar2Week } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { PostResult } from "@/lib/requests/getPosts";

export default function PostCard({ post }: { post?: PostResult }): React.JSX.Element {
	return (
		<>
			{post ? (
				<div className="mb-8 rounded-lg bg-[#0e0a1f] p-0 pb-6 shadow-[0px_15px_30px_-15px_#211e35] lg:p-8">
					<div className="relative mb-6 overflow-hidden pb-60 shadow-md">
						<Image
							width={100}
							height={100}
							src={post.featuredImage.url}
							alt=""
							className="absolute h-60 w-full rounded-t-lg object-cover object-top shadow-lg lg:rounded-lg"
						/>
					</div>
					<h1 className="mb-5 cursor-pointer text-center text-2xl font-semibold transition duration-700 hover:text-pink-600 sm:text-3xl">
						<Link href={`/post/${post.slug}`}>{post.title}</Link>
					</h1>
					<div className="mb-6 hidden w-full items-center justify-center text-center sm:flex">
						<div className="mb-4 mr-8 flex w-full items-center justify-center sm:mb-0 sm:w-auto">
							<Image
								alt={post.author.name}
								height={30}
								width={30}
								className="rounded-full align-middle"
								src={post.author.photo.url}
							/>
							<p className="text-md ml-2 inline align-middle font-medium text-gray-300 sm:text-lg">
								{post.author.name}
							</p>
						</div>
						<div className="font-medium text-gray-300">
							<BsCalendar2Week className="mr-2 inline h-6 w-6 text-pink-500" />
							<span className="text-md align-middle sm:text-lg">
								{moment(post.createdAt).format("MMM DD, YYYY")}
							</span>
						</div>
					</div>
					<p className="mb-6 line-clamp-3 px-5 text-center text-[15px] font-normal text-gray-500 sm:line-clamp-none sm:text-[16px] lg:px-0">
						{post.excerpt}
					</p>
					<div className="text-center">
						<Link href={`/post/${post.slug}`}>
							<span className="ease text-white text-md inline-block transform cursor-pointer rounded-full bg-pink-600 px-8 py-3 font-medium transition duration-500 hover:-translate-y-1">
								Continue Reading
							</span>
						</Link>
					</div>
				</div>
			) : (
				<SkeletonTheme baseColor="#1f1a2e" highlightColor="#211e35">
					<div className="mb-8 rounded-lg bg-[#0e0a1f] p-0 pb-6 shadow-[0px_15px_30px_-15px_#211e35] lg:p-8">
						<div className="relative mb-6 overflow-hidden shadow-md">
							<Skeleton className="absolute h-60 w-full animate-pulse rounded-t-lg object-cover object-top shadow-lg lg:rounded-lg" />
						</div>
						<h1 className="mb-5  cursor-pointer px-5 text-center text-2xl font-semibold transition duration-700 hover:text-pink-600 sm:text-3xl lg:px-0">
							<Skeleton className="animate-pulse" />
						</h1>
						<p className="line-clamp-3 px-5 text-center text-[15px] font-normal text-gray-500 sm:line-clamp-none sm:text-[16px] lg:px-0">
							<Skeleton height={100} className="w-full animate-pulse" />
						</p>
					</div>
				</SkeletonTheme>
			)}
		</>
	);
}
