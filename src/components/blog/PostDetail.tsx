"use client";

import "@/styles/markdown-dark.css";

import moment from "moment";
import Image from "next/image";
import React from "react";
import { BsCalendar2Week } from "react-icons/bs";

import { PostDetailsResult } from "@/lib/requests/getPostDetails";

interface MarkdownResponse extends Response {
	result: string;
}

export default function PostDetail({ post }: { post: PostDetailsResult }): React.JSX.Element {
	const [toHtml, setToHtml] = React.useState<{ data: string }>({ data: "" });
	React.useEffect(() => {
		let text = "";
		for (const child of post.content.raw.children) {
			for (const c of child.children) {
				text += c.text;
			}
		}
		text = text.trim();
		void fetch("/api/markdown", {
			method: "POST",
			body: JSON.stringify({ text }),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((response) => {
			void response.json().then((response: MarkdownResponse) => {
				const data = response.result.replace(/user-content-/g, "");
				setToHtml({ data });
			});
		});
	}, [post.content.text]);
	return (
		<div className="mb-8 rounded-lg bg-[#0e0a1f] p-0 pb-6 shadow-[0px_15px_30px_-15px_#211e35] lg:p-8">
			<div className="relative mb-6 overflow-hidden shadow-md">
				<Image
					width={100}
					height={100}
					src={post.featuredImage.url}
					alt=""
					className="h-full w-full rounded-t-lg object-cover object-top shadow-lg lg:rounded-lg"
				/>
			</div>
			<div className="px-2 lg:px-0">
				<div className="mb-6 flex w-full items-center justify-between px-4">
					<div className="mr-8 hidden items-center justify-center sm:flex lg:mb-0 lg:w-auto">
						<Image
							alt={post.author.name}
							height={30}
							width={30}
							className="rounded-full align-middle"
							src={post.author.photo.url}
						/>
						<p className="ml-2 inline align-middle text-lg font-medium text-gray-300">{post.author.name}</p>
					</div>
					<div className="font-medium text-gray-300">
						<BsCalendar2Week className="mr-2 inline h-4 w-4 text-pink-500 sm:h-6 sm:w-6" />
						<span className="align-middle text-sm sm:text-base">
							{moment(post.createdAt).format("MMM DD, YYYY")}
						</span>
					</div>
				</div>
				<h1 className="mb-6 text-center text-2xl font-semibold sm:text-3xl">{post.title}</h1>
				<article className="markdown-body-dark" dangerouslySetInnerHTML={{ __html: toHtml.data }} />
			</div>
		</div>
	);
}
