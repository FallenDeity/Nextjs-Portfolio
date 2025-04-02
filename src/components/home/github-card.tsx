"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ExternalLink, GitCommit, GitFork, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";

interface StatusCardProps {
	github_username: string;
}

export function StatusCard({ github_username }: StatusCardProps): React.ReactElement {
	const [stats, setStats] = React.useState({
		name: "",
		stars: 0,
		repos: 0,
		followers: 0,
		gists: 0,
	});

	React.useEffect(() => {
		const fetchGitHubStats = async (): Promise<void> => {
			try {
				const [userRes, reposRes] = await Promise.all([
					fetch(`https://api.github.com/users/${github_username}`),
					fetch(`https://api.github.com/users/${github_username}/repos`),
				]);

				if (!userRes.ok || !reposRes.ok) throw new Error("Failed to fetch data");

				const userData = (await userRes.json()) as {
					name: string;
					followers: number;
					public_repos: number;
					public_gists: number;
				};
				const reposData = (await reposRes.json()) as { stargazers_count: number }[];

				const stars = Array.isArray(reposData)
					? reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
					: 0;

				setStats({
					name: userData.name || github_username,
					followers: userData.followers ?? 0,
					repos: userData.public_repos ?? 0,
					gists: userData.public_gists ?? 0,
					stars,
				});
			} catch (error) {
				console.error("Error fetching GitHub data:", error);
			}
		};

		void fetchGitHubStats();
	}, []);

	return (
		<BentoCard className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4" name="Status">
			<div className="flex h-full w-full flex-col items-center p-6">
				{/* Profile Card */}
				<div className="bg-card/60 relative flex w-full cursor-pointer items-center rounded-md border p-3">
					<GitHubLogoIcon className="h-16 w-16 rounded-md" />
					<div className="ml-4">
						<div className="text-md font-bold">{stats.name || "Triyan Mukherjee"}</div>
						<div className="text-muted-foreground text-sm">{github_username}</div>
					</div>
					<Link
						href={`https://github.com/${github_username}`}
						passHref
						target="_blank"
						className="absolute top-3 right-3">
						<ExternalLink />
					</Link>
					<Image
						src="/cat.webp"
						alt="profile"
						fill
						className="absolute inset-0 z-[-1] h-full w-full rounded-md object-cover"
					/>
					<div className="via-background/20 to-background absolute inset-0 z-[-1] bg-gradient-to-bl from-transparent" />
				</div>

				{/* Stats Section */}
				<div className="mt-4 flex w-full flex-wrap justify-between border-t px-6 pt-6">
					{[
						{ icon: Star, label: "Stars", value: stats.stars },
						{ icon: Users, label: "Followers", value: stats.followers },
						{ icon: GitFork, label: "Repositories", value: stats.repos },
						{ icon: GitCommit, label: "Gists", value: stats.gists },
					].map(({ icon: Icon, label, value }) => (
						<div key={label} className="flex flex-col items-center space-y-2">
							<Icon size={24} />
							<div className="text-muted-foreground text-xs">{label}</div>
							<div className="text-md font-bold">{value}</div>
						</div>
					))}
				</div>
			</div>
		</BentoCard>
	);
}
