"use client";

import { LoaderCircle, Search, TagIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CARD_STYLE_STRING, cn } from "@/lib/utils";
import { CATEGORIES_QUERYResult } from "@/sanity/sanity.types";

import { Checkbox } from "../ui/checkbox";

interface SearchBarProps {
	tags: CATEGORIES_QUERYResult;
}

export function SearchBar({ tags }: SearchBarProps): React.ReactElement {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [searchValue, setSearchValue] = useState(searchParams.get("query") || "");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const tagsParam = searchParams.get("tags");
		if (tagsParam) {
			setSelectedTags(tagsParam.split(","));
		}
	}, [searchParams]);

	const handleSearch = (): void => {
		const params = new URLSearchParams(searchParams);

		if (searchValue) {
			params.set("query", searchValue);
		} else {
			params.delete("query");
		}

		if (selectedTags.length > 0) {
			params.set("tags", selectedTags.join(","));
		} else {
			params.delete("tags");
		}

		startTransition(() => {
			router.push(`/blog?${params.toString()}`);
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent): void => {
		// Handle tag selection with keyboard shortcuts
		if (e.key === "Enter") {
			handleSearch();
		} else if (e.key === "Backspace" && searchValue === "" && selectedTags.length > 0) {
			// Remove the last tag when backspace is pressed and search input is empty
			const newTags = [...selectedTags];
			newTags.pop();
			setSelectedTags(newTags);

			// Update URL without the removed tag
			const params = new URLSearchParams(searchParams);
			params.set("tags", newTags.join(","));
			if (searchValue) {
				params.set("query", searchValue);
			}

			startTransition(() => {
				router.push(`/blog?${params.toString()}`);
			});
		}
	};

	const toggleTag = (tagSlug: string): void => {
		let newTags: string[];

		if (selectedTags.includes(tagSlug)) {
			newTags = selectedTags.filter((tag) => tag !== tagSlug);
		} else {
			newTags = [...selectedTags, tagSlug];
		}

		setSelectedTags(newTags);
		setIsTagPopoverOpen(false);

		// Focus back on the input after selecting a tag
		if (inputRef.current) {
			inputRef.current.focus();
		}

		// Update URL with new tags
		const params = new URLSearchParams(searchParams);

		if (newTags.length > 0) {
			params.set("tags", newTags.join(","));
		} else {
			params.delete("tags");
		}

		if (searchValue) {
			params.set("query", searchValue);
		}

		startTransition(() => {
			router.push(`/blog?${params.toString()}`);
		});
	};

	const removeTag = (tagSlug: string): void => {
		const newTags = selectedTags.filter((tag) => tag !== tagSlug);
		setSelectedTags(newTags);

		// Update URL without the removed tag
		const params = new URLSearchParams(searchParams);

		if (newTags.length > 0) {
			params.set("tags", newTags.join(","));
		} else {
			params.delete("tags");
		}

		if (searchValue) {
			params.set("query", searchValue);
		}

		startTransition(() => {
			router.push(`/blog?${params.toString()}`);
		});
	};

	const getTagName = (slug: string): string => {
		const category = tags.find((cat) => cat.slug.current === slug);
		return category?.slug.current || "";
	};

	return (
		<div className="sticky top-6 z-10 w-full">
			<div className="relative flex h-12 w-full items-center justify-center">
				<div className="bg-card/40 flex h-full w-full items-center gap-1 overflow-hidden rounded-xl pl-9 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]">
					{/* Selected tags */}
					<div className="flex flex-wrap items-center gap-1">
						{selectedTags.map((tag) => (
							<Badge key={tag} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
								{getTagName(tag)}
								<button onClick={() => removeTag(tag)} className="cursor-pointer rounded-full p-0.5">
									<X size={12} className="text-muted-foreground" />
								</button>
							</Badge>
						))}
					</div>

					<Input
						ref={inputRef}
						className="h-full flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={selectedTags.length > 0 ? "" : "Search..."}
					/>

					<Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
						<PopoverTrigger asChild>
							<button
								className="text-muted-foreground mr-2 cursor-pointer rounded-md p-1"
								aria-label="Filter by tags">
								<TagIcon size={16} />
							</button>
						</PopoverTrigger>
						<PopoverContent className={cn("w-[224px] p-0", CARD_STYLE_STRING)} align="end">
							<Command className="bg-transparent">
								<CommandInput placeholder="Search tags..." />
								<CommandList className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/5 max-h-64 overflow-y-auto">
									<CommandEmpty>No tags found</CommandEmpty>
									<CommandGroup>
										{tags.map((category) => (
											<CommandItem
												key={category._id}
												onSelect={() => toggleTag(category.slug.current)}
												className="flex cursor-pointer items-center justify-between hover:bg-transparent">
												<span>{category.title}</span>
												<Checkbox
													className="border-muted-foreground/40 bg-muted/40 cursor-pointer"
													checked={selectedTags.includes(category.slug.current)}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
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
			</div>
		</div>
	);
}
