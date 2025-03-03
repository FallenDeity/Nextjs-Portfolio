"use client";

import { LoaderCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import { Input } from "@/components/ui/input";

export function SearchBar(): React.ReactElement {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const searchAction = (formData: FormData): void => {
		const query = formData.get("search") as string;
		const params = new URLSearchParams({ query });
		startTransition(() => {
			router.push(`/blog?${params.toString()}`);
		});
	};

	return (
		<div className="sticky top-6 z-10 h-12 w-full">
			<form className="relative flex h-full w-full items-center justify-center" action={searchAction}>
				<Input
					className="peer bg-card/40 h-full transform-gpu rounded-xl ps-9 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]"
					name="search"
					placeholder="Search..."
					type="search"
				/>
				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					{isPending ? (
						<LoaderCircle
							className="animate-spin"
							size={16}
							strokeWidth={2}
							role="status"
							aria-label="Loading..."
						/>
					) : (
						<Search size={16} strokeWidth={2} aria-hidden="true" />
					)}
				</div>
			</form>
		</div>
	);
}
