import Image from "next/image";
import React from "react";

import { PostDetailsResult } from "@/lib/requests/getPostDetails";

export default function Author({ author }: { author: PostDetailsResult["author"] }): React.JSX.Element {
	return (
		<div className="relative mb-8 mt-20 rounded-lg bg-[#0e0a1f] px-12 pb-6 pt-12 text-center shadow-[0px_15px_30px_-15px_#211e35]">
			<div className="absolute -top-12 left-1/2 -translate-x-1/2 transform">
				<Image
					alt={author.name}
					height={120}
					width={120}
					className="rounded-full align-middle"
					src={author.photo.url}
				/>
			</div>
			<h3 className="text-white mb-4 mt-10 text-xl font-bold">{author.name}</h3>
			<p className="text-white text-ls">{author.bio}</p>
		</div>
	);
}
