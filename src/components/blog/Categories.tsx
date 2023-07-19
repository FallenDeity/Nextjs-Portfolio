"use client";

import Link from "next/link";
import React from "react";

import getCategories, { CategoryResult } from "@/lib/requests/getCategories";

const colors = [
	"bg-[#f56565]",
	"bg-[#ed8936]",
	"bg-[#ecc94b]",
	"bg-[#48bb78]",
	"bg-[#38b2ac]",
	"bg-[#4299e1]",
	"bg-[#667eea]",
	"bg-[#9f7aea]",
	"bg-[#ed64a6]",
	"bg-[#f56565]",
	"bg-[#ed8936]",
	"bg-[#ecc94b]",
];

export default function Categories(): React.JSX.Element {
	const [categories, setCategories] = React.useState<CategoryResult[]>([]);
	React.useEffect(() => {
		void getCategories().then((res) => setCategories(res));
	}, []);
	return (
		<div className="mb-8 rounded-lg bg-[#0e0a1f] p-8 pb-12 shadow-[0px_15px_30px_-15px_#211e35]">
			<h3 className="mb-8 border-b pb-4 text-xl font-semibold">Categories</h3>
			<div className="flex flex-wrap gap-3">
				{categories.map((category, index) => (
					<Link
						key={index}
						href={`/category/${category.slug}`}
						className={`${colors[Math.floor(Math.random() * colors.length)]} h-6 rounded-full px-4`}>
						<span>{category.name}</span>
					</Link>
				))}
			</div>
		</div>
	);
}
