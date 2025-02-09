"use client";

import { CalendarIcon, EnvelopeClosedIcon, FaceIcon, GearIcon, PersonIcon, RocketIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { useKeyPress } from "@/hooks/use-key-press";

export default function CommandPalette(): React.JSX.Element | null {
	const [open, setOpen] = useState(false);

	useKeyPress({
		keyPressItems: [
			{
				keys: ["Meta", "KeyK"],
				event: (): void => setOpen((prev) => !prev),
			},
			{
				keys: ["Control", "KeyK"],
				event: (): void => setOpen((prev) => !prev),
			},
			{
				keys: ["Escape"],
				event: (): void => setOpen(false),
			},
		],
	});

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<Command className="bg-popover/70 h-fit rounded-lg border shadow-md backdrop-blur-sm backdrop-filter">
				<CommandInput placeholder="Type a command or search..." />
				<CommandList className="scrollbar-thin scrollbar-track-popover scrollbar-thumb-accent">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<CalendarIcon className="mr-2 h-4 w-4" />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<FaceIcon className="mr-2 h-4 w-4" />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem disabled>
							<RocketIcon className="mr-2 h-4 w-4" />
							<span>Launch</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<PersonIcon className="mr-2 h-4 w-4" />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<EnvelopeClosedIcon className="mr-2 h-4 w-4" />
							<span>Mail</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<GearIcon className="mr-2 h-4 w-4" />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
