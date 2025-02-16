"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { cn } from "@/lib/utils";

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>): React.ReactElement {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>): React.ReactElement {
	return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent({
	className,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>): React.ReactElement {
	return (
		<CollapsiblePrimitive.CollapsibleContent
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:duration-300 data-[state=open]:ease-in-out",
				className
			)}
			data-slot="collapsible-content"
			{...props}
		/>
	);
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
