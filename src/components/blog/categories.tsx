"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

import { CARD_STYLE_STRING, cn, colorFromString } from "@/lib/utils";
import { CATEGORIES_QUERYResult } from "@/sanity/sanity.types";

import { Button } from "../ui/button";

export default function Categories({ categories }: { categories: CATEGORIES_QUERYResult }): React.ReactElement {
	const { resolvedTheme } = useTheme();
	const searchParams = useSearchParams();
	const [displayCount, setDisplayCount] = useState(10);
	const increment = 10;
	const hasMore = categories.length > displayCount;

	const createQuery = (newTag: string): string => {
		const query = new URLSearchParams(searchParams);
		query.set("tags", newTag);
		return `?${query.toString()}`;
	};

	const handleShow = (): void => {
		if (hasMore) {
			return setDisplayCount((prev) => prev + increment);
		}
		setDisplayCount(10);
	};

	return (
		<div className={cn("mt-4 flex flex-col gap-2 rounded-xl p-4", CARD_STYLE_STRING)}>
			<h3 className="mb-2 text-xl font-semibold">Categories</h3>
			<span className="border-muted-foreground/20 border-t" />
			<div className="mt-2 flex flex-wrap gap-2.5">
				{categories.slice(0, displayCount).map((category) => (
					<Link
						prefetch={false}
						href={`/blog${createQuery(category.slug.current)}`}
						key={category.slug.current}
						style={{ color: colorFromString(category.slug.current, resolvedTheme as "dark" | "light") }}
						className="bg-muted rounded-full border px-1.5 py-0.5 font-mono text-xs lowercase dark:border-none">
						#{category.slug.current}
					</Link>
				))}
			</div>
			<Button
				onClick={handleShow}
				variant={"outline"}
				className="hover:bg-primary/5 border-muted-foreground/40 mt-2 w-full cursor-pointer bg-transparent font-mono transition-colors duration-300 ease-in-out">
				{hasMore ? (
					<>
						Show More
						<ChevronDown />
					</>
				) : (
					<>
						Show Less
						<ChevronUp />
					</>
				)}
			</Button>
		</div>
	);
}
