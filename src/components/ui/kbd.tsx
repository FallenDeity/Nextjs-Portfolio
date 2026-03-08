import React from "react";

import { cn } from "@/lib/utils";

export type KbdKey =
	| "command"
	| "shift"
	| "ctrl"
	| "option"
	| "enter"
	| "delete"
	| "escape"
	| "tab"
	| "capslock"
	| "up"
	| "right"
	| "down"
	| "left"
	| "pageup"
	| "pagedown"
	| "home"
	| "end"
	| "help"
	| "space"
	| "fn"
	| "win"
	| "alt";

export const kbdKeysMap: Record<KbdKey, string> = {
	command: "⌘",
	shift: "⇧",
	ctrl: "⌃",
	option: "⌥",
	enter: "↵",
	delete: "⌫",
	escape: "⎋",
	tab: "⇥",
	capslock: "⇪",
	up: "↑",
	right: "→",
	down: "↓",
	left: "←",
	pageup: "⇞",
	pagedown: "⇟",
	home: "↖",
	end: "↘",
	help: "?",
	space: "␣",
	fn: "Fn",
	win: "⌘",
	alt: "⌥",
};

export const kbdKeysLabelMap: Record<KbdKey, string> = {
	command: "Command",
	shift: "Shift",
	ctrl: "Control",
	option: "Option",
	enter: "Enter",
	delete: "Delete",
	escape: "Escape",
	tab: "Tab",
	capslock: "Caps Lock",
	up: "Up",
	right: "Right",
	down: "Down",
	left: "Left",
	pageup: "Page Up",
	pagedown: "Page Down",
	home: "Home",
	end: "End",
	help: "Help",
	space: "Space",
	fn: "Fn",
	win: "Win",
	alt: "Alt",
};

export type KbdKeysLabelType = typeof kbdKeysLabelMap;

export interface KbdProps {
	keys: KbdKey[];
	children?: React.ReactNode;
}

function Kbd({ keys, children }: KbdProps): React.ReactElement {
	return (
		<kbd
			className={cn(
				"bg-muted text-muted-foreground pointer-events-none inline-flex h-6 items-center justify-center gap-1 rounded border px-1.5 text-center font-mono text-[10px] font-medium opacity-100 select-none"
			)}>
			{keys?.map((key, i) => (
				<span key={i} title={kbdKeysLabelMap[key]} className={cn("text-xs")}>
					{kbdKeysMap[key]}
				</span>
			))}
			<span className={cn("text-xs")}>{children}</span>
		</kbd>
	);
}

export { Kbd };
