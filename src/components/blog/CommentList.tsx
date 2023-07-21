"use client";

import parse from "html-react-parser";
import React from "react";
import Avatar from "react-avatar";
import Moment from "react-moment";

import { CommentResult, getComments } from "@/lib/requests/Comments";

export default function CommentList({ slug }: { slug: string }): React.JSX.Element {
	const [comments, setComments] = React.useState<CommentResult[]>([]);
	React.useEffect(() => {
		void getComments(slug).then((res) => setComments(res));
	}, [slug]);
	return (
		<>
			{comments.length > 0 && (
				<div className="space-y-4 rounded-lg bg-[#0e0a1f] p-4 shadow-[0px_15px_30px_-15px_#211e35] xs:p-8">
					<h3 className="mb-8 border-b pb-4 text-center text-xl font-semibold">Comments</h3>
					{comments.map((comment) => (
						<div key={comment.id} className="flex flex-col rounded-lg bg-[#1a162f] p-4">
							<div className="mb-2 flex flex-row items-center justify-between">
								<div className="flex flex-row items-center justify-center">
									<Avatar name={comment.name} size="35" round />
									<div className="ml-3 flex flex-col">
										<p className="text-sm font-semibold">{comment.name}</p>
										<p className="hidden text-xs text-gray-400 xs:block">{comment.email}</p>
									</div>
								</div>
								<p className="text-xs text-gray-400">
									<Moment fromNow>{comment.createdAt}</Moment>
								</p>
							</div>
							<div className="mt-2 whitespace-pre-line border-t px-2 py-4 text-sm">
								{parse(comment.comment)}
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
}
