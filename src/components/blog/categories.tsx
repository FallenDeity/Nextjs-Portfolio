"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

import { CARD_STYLE_STRING, cn, colorFromString } from "@/lib/utils";
import { CATEGORIES_QUERYResult } from "@/sanity/sanity.types";

export default function Categories({ categories }: { categories: CATEGORIES_QUERYResult }): React.ReactElement {
	const { resolvedTheme } = useTheme();
	const searchParams = useSearchParams();

	const createQuery = (newTag: string): string => {
		const query = new URLSearchParams(searchParams);
		query.set("tags", newTag);
		return `?${query.toString()}`;
	};
	return (
		<div className={cn("mt-4 flex flex-col gap-2 rounded-xl py-4", CARD_STYLE_STRING)}>
			<h3 className="mb-2 px-4 text-xl font-semibold">Categories</h3>
			<span className="border-muted-foreground/20 mx-4 border-t" />
			<div className="mt-2 flex flex-wrap gap-2.5 px-4">
				{categories.map((category) => (
					<Link
						href={`/blog${createQuery(category.slug.current)}`}
						key={category.slug.current}
						style={{ color: colorFromString(category.slug.current, resolvedTheme as "dark" | "light") }}
						className="bg-muted rounded-full border px-1.5 py-0.5 font-mono text-xs lowercase dark:border-none">
						#{category.slug.current}
					</Link>
				))}
			</div>
		</div>
	);
}
