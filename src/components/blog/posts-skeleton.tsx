import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function PostListSkeleton(): React.ReactElement {
	return (
		<ul className="flex h-full w-full flex-1 flex-col gap-10">
			{Array.from({ length: 10 }).map((_, i) => (
				<li key={i}>
					<Skeleton className="bg-card/40 col-span-1 h-[420px] w-full transform-gpu rounded-xl [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]" />
				</li>
			))}
		</ul>
	);
}
