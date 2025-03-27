"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ExternalLink, GitCommit, GitFork, Star, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { preconnect } from "react-dom";

import { BentoCard } from "@/components/magicui/bento-grid";

export function StatusCard(): React.ReactElement {
	preconnect("https://api.github.com");
	const [stars, setStars] = React.useState<number>(0);
	const [repos, setRepos] = React.useState<number>(0);
	const [followers, setFollowers] = React.useState<number>(0);
	const [gists, setGists] = React.useState<number>(0);

	React.useEffect(() => {
		void fetch("https://api.github.com/users/FallenDeity")
			.then((res) => res.json())
			.catch((err) => console.error(err))
			.then((data: { followers: number; public_repos: number; public_gists: number }) => {
				setFollowers(data.followers ?? 0);
				setRepos(data.public_repos ?? 0);
				setGists(data.public_gists ?? 0);
			});
	}, []);

	React.useEffect(() => {
		void fetch("https://api.github.com/users/FallenDeity/repos")
			.then((res) => res.json())
			.catch((err) => console.error(err))
			.then((data: { stargazers_count: number }[]) => {
				if (!Array.isArray(data)) return;
				setStars(data.reduce((acc, curr) => acc + curr.stargazers_count, 0));
			});
	}, []);
	return (
		<BentoCard className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4" name="Status">
			<div className="flex h-full w-full flex-col items-center p-6">
				<div className="bg-card/60 relative flex w-full cursor-pointer flex-row items-center rounded-md border p-3">
					<GitHubLogoIcon className="h-16 w-16 rounded-md" />
					<div className="ml-4 flex flex-col items-start space-y-1">
						<div className="text-md font-bold">Asher</div>
						<div className="text-muted-foreground text-sm">FallenDeity</div>
					</div>
					<ExternalLink className="absolute top-3 right-3" />
					<Image
						src="/cat.jpg"
						alt="profile"
						fill
						className="absolute top-0 left-0 z-[-1] h-full w-full rounded-md object-cover"
					/>
					<div className="to-background via-background/20 absolute top-0 left-0 z-[-1] h-full w-full bg-gradient-to-bl from-transparent" />
				</div>
				<div className="mt-4 flex w-full flex-row flex-wrap items-center justify-between border-t px-6 pt-6">
					<div className="flex flex-col items-center justify-between space-y-2">
						<Star size={24} />
						<div className="text-muted-foreground text-xs">Stars</div>
						<div className="text-md font-bold">{stars}</div>
					</div>
					<div className="flex flex-col items-center justify-between space-y-2">
						<Users size={24} />
						<div className="text-muted-foreground text-xs">Followers</div>
						<div className="text-md font-bold">{followers}</div>
					</div>
					<div className="flex flex-col items-center justify-between space-y-2">
						<GitFork size={24} />
						<div className="text-muted-foreground text-xs">Repositories</div>
						<div className="text-md font-bold">{repos}</div>
					</div>
					<div className="flex flex-col items-center justify-between space-y-2">
						<GitCommit size={24} />
						<div className="text-muted-foreground text-xs">Gists</div>
						<div className="text-md font-bold">{gists}</div>
					</div>
				</div>
			</div>
		</BentoCard>
	);
}
