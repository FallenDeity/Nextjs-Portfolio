import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ExternalLink, GitCommit, GitFork, Star, Users } from "lucide-react";
import * as React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";

export function StatusCard(): React.ReactElement {
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
				</div>
				<div className="mt-4 flex w-full flex-row flex-wrap items-center justify-between border-t px-6 pt-4">
					<div className="flex flex-col items-center justify-between space-y-2">
						<Star size={24} />
						<div className="text-muted-foreground text-xs">Stars</div>
						<div className="text-md font-bold">0</div>
					</div>
					<div className="flex flex-col items-center justify-between space-y-2">
						<GitCommit size={24} />
						<div className="text-muted-foreground text-xs">Commits</div>
						<div className="text-md font-bold">0</div>
					</div>
					<div className="flex flex-col items-center justify-between space-y-2">
						<Users size={24} />
						<div className="text-muted-foreground text-xs">Followers</div>
						<div className="text-md font-bold">0</div>
					</div>
					<div className="flex flex-col items-center justify-between space-y-2">
						<GitFork size={24} />
						<div className="text-muted-foreground text-xs">Forks</div>
						<div className="text-md font-bold">0</div>
					</div>
				</div>
			</div>
		</BentoCard>
	);
}
