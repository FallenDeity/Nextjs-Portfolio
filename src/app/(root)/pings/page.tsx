import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import { PingTimeline } from "@/components/pings/ping-timeline";
import { sanityFetch } from "@/sanity/lib/client";
import { PINGS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
	title: "Pings",
	description: "A collection of my thoughts, ideas, and experiences.",
	keywords: [
		"pings",
		"thoughts",
		"ideas",
		"experiences",
		"blog",
		"posts",
		"texts",
		"philosophy",
		"technical",
		"competitions",
		"certifications",
	],
	openGraph: {
		siteName: "Pings",
		url: "/pings",
		images: [
			{
				url: "/pings-open-graph.png",
				alt: "Pings",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: [
			{
				url: "/pings-open-graph.png",
				alt: "Pings",
				width: 1200,
				height: 630,
			},
		],
	},
};

export default async function PingPage(): Promise<React.ReactElement> {
	const pings = await sanityFetch({
		query: PINGS_QUERY,
		tags: ["ping", "category"],
	});
	return (
		<div className="z-10 m-6 mx-auto mb-44 min-h-screen w-full max-w-3xl overflow-hidden p-4 font-mono md:pb-36">
			<div>
				<h1 className="text-6xl font-bold">Pings</h1>
				<p className="text-muted-foreground mt-4">
					Welcome to my pings page! Here, I share my thoughts, ideas, and experiences. Feel free to explore
					and engage with my content. Subscribe to my{" "}
					<Link href="/pings/rss.xml" className="text-primary underline" prefetch={false}>
						RSS feed
					</Link>{" "}
					to stay updated with my latest pings.
				</p>
			</div>
			<div className="mt-10 flex flex-col gap-4">
				<PingTimeline pings={pings} />
			</div>
		</div>
	);
}
