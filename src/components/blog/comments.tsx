"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface CommentsProps {
	repo: `${string}/${string}`;
	repoId: string;
	category: string;
	categoryId: string;
}

export default function Comments({ repo, repoId, category, categoryId }: CommentsProps): React.ReactElement {
	const { resolvedTheme } = useTheme();
	return (
		<Giscus
			repo={repo}
			repoId={repoId}
			category={category}
			categoryId={categoryId}
			mapping="pathname"
			strict={"1"}
			reactionsEnabled={"1"}
			emitMetadata={"0"}
			inputPosition={"top"}
			theme={resolvedTheme === "dark" ? "catppuccin_macchiato" : "light"}
			loading="lazy"
			lang="en"
		/>
	);
}
