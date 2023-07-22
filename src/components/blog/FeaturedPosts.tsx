"use client";

import "react-multi-carousel/lib/styles.css";

import React from "react";
import Carousel from "react-multi-carousel";

import { FeaturedPostResult, getFeaturedPosts } from "@/lib/requests/getFeaturedPosts";

import FeaturedPostCard from "./FeaturedPostCard";

const responsive = {
	superLargeDesktop: {
		breakpoint: { max: 4000, min: 1024 },
		items: 5,
	},
	desktop: {
		breakpoint: { max: 1024, min: 768 },
		items: 3,
	},
	tablet: {
		breakpoint: { max: 768, min: 640 },
		items: 2,
	},
	mobile: {
		breakpoint: { max: 640, min: 0 },
		items: 1,
	},
};

export default function FeaturedPosts(): React.JSX.Element {
	const [posts, setPosts] = React.useState<FeaturedPostResult[]>([]);
	React.useEffect(() => {
		void getFeaturedPosts().then((posts) => setPosts(posts));
	}, []);
	const customLeftArrow = (
		<div className="arrow-btn absolute left-0 flex w-[50px] cursor-pointer items-center justify-center rounded-full bg-pink-600 py-3 text-center transition-all duration-300 ease-in-out hover:bg-purple-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="text-white h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</div>
	);

	const customRightArrow = (
		<div className="absolute right-0 flex w-[50px] cursor-pointer items-center justify-center rounded-full bg-pink-600 py-3 text-center transition-all duration-300 ease-in-out hover:bg-purple-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="text-white h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
			</svg>
		</div>
	);

	return (
		<div className="mb-8">
			<Carousel
				infinite
				customLeftArrow={customLeftArrow}
				customRightArrow={customRightArrow}
				responsive={responsive}
				itemClass="px-4">
				{posts.length > 0 && posts.map((post, index) => <FeaturedPostCard key={index} post={post} />)}
			</Carousel>
		</div>
	);
}
