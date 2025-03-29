import "@/styles/blog.css";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineDescription,
	TimelineItem,
	TimelineSeparator,
	TimelineTitle,
} from "@/components/ui/timeline";
import { CARD_STYLE_STRING, cn, formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { PINGS_QUERYResult } from "@/sanity/sanity.types";

import { CustomMDX } from "../mdx/mdx-remote";

type Ping = PINGS_QUERYResult[number];

interface PingTimelineProps {
	pings: Ping[];
}

export const PingTimeline: React.FC<PingTimelineProps> = ({ pings }) => {
	return (
		<Timeline className="mt-4">
			{pings.map((ping) => (
				<TimelineItem key={ping._id} className="relative" id={ping.slug.current}>
					<TimelineSeparator>
						<div className="text-foreground-muted relative font-mono text-sm text-[var(--accent-custom)]">
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 512 512"
								className="text-[var(--accent-custom)]"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
							</svg>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 512 512"
								className="absolute top-0 animate-pulse text-[var(--accent-custom)]"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
							</svg>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 512 512"
								className="absolute top-0 animate-ping text-[var(--accent-custom)]"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
							</svg>
						</div>
						<TimelineConnector className="bg-[var(--accent-custom)]" />
					</TimelineSeparator>
					<TimelineContent
						className={cn("mb-10 flex flex-col gap-2 rounded-md p-4 md:p-6", CARD_STYLE_STRING)}>
						<div className="flex justify-between">
							<TimelineTitle className="flex text-3xl font-semibold md:text-4xl">
								{ping.link ? (
									<Link
										href={ping.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary underline">
										{ping.title}
									</Link>
								) : (
									ping.title
								)}
							</TimelineTitle>
							<span className="text-muted-foreground min-w-36 text-end text-xs md:text-sm">
								{formatDate(ping.publishedAt, true)}
							</span>
						</div>
						{ping.image && (
							<div className="relative mt-2 flex h-[300px]">
								<Image
									src={urlFor(ping.image).width(1280).url()}
									alt={ping.title}
									fill
									placeholder="blur"
									blurDataURL={urlFor(ping.image).width(16).height(9).dpr(2).blur(20).url() || ""}
									className="rounded-md object-cover"
								/>
							</div>
						)}
						<div className="markdown-body text-foreground/90 mt-4 text-sm">
							<CustomMDX source={ping.body} addToc={false} />
						</div>
						<TimelineDescription className="flex flex-wrap gap-2">
							{(ping.tags ?? []).map((tag) => (
								<span
									key={tag.slug.current}
									className="text-muted-foreground rounded-full bg-[var(--accent-custom)]/20 px-1.5 py-0.5 font-mono text-sm lowercase">
									#{tag.slug.current}
								</span>
							))}
						</TimelineDescription>
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	);
};
