import { Info, Lightbulb, MessageSquareWarning, OctagonAlert, TriangleAlert } from "lucide-react";
import { MDXComponents } from "mdx/types";
import Image from "next/image";
import React from "react";

import { cn } from "@/lib/utils";

import { Kbd } from "../ui/kbd";
import Pre from "./copy-button";
import { mdSerialize } from "./mdx-serializer";
import { Mermaid } from "./mermaid";

const Alert = ({ type, children }: { type: string; children: React.ReactNode }): React.ReactElement => {
	const IconMap = {
		note: <Info className="h-4 w-4 text-blue-500" />,
		tip: <Lightbulb className="h-4 w-4 text-green-500" />,
		important: <MessageSquareWarning className="h-4 w-4 text-purple-500" />,
		warning: <TriangleAlert className="h-4 w-4 text-amber-500" />,
		caution: <OctagonAlert className="h-4 w-4 text-red-500" />,
	};
	return (
		<div
			className={cn(
				"my-4 flex flex-col border-l-4 p-4",
				{
					"border-blue-500 bg-blue-50 dark:bg-blue-900/30": type.toUpperCase() === "NOTE",
					"border-green-500 bg-green-50 dark:bg-green-900/30": type.toUpperCase() === "TIP",
					"border-purple-500 bg-purple-50 dark:bg-purple-900/30": type.toUpperCase() === "IMPORTANT",
					"border-amber-500 bg-amber-50 dark:bg-amber-900/30": type.toUpperCase() === "WARNING",
					"border-red-500 bg-red-50 dark:bg-red-900/30": type.toUpperCase() === "CAUTION",
				},
				"rounded-md"
			)}>
			<div className="flex items-center space-x-2">
				{IconMap[type.toLowerCase() as keyof typeof IconMap]}
				<span className="text-sm font-semibold text-gray-900 capitalize dark:text-gray-100">{type}</span>
			</div>
			<div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{children}</div>
		</div>
	);
};

const ResponsiveImage = (props: React.ImgHTMLAttributes<HTMLImageElement>): React.JSX.Element => {
	// @ts-expect-error - Missing properties
	return <Image alt={props.alt ?? ""} sizes="100vw" style={{ width: "100%", height: "auto" }} {...props} />;
};

const components: MDXComponents = {
	h1: ({ className, ...props }: React.HTMLProps<HTMLHeadingElement>): React.ReactElement => (
		<h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props} />
	),
	h2: ({ className, ...props }: React.HTMLProps<HTMLHeadingElement>): React.ReactElement => (
		<h2
			className={cn(
				"mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
				className
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: React.HTMLProps<HTMLHeadingElement>): React.ReactElement => (
		<h3 className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
	),
	h4: ({ className, ...props }: React.HTMLProps<HTMLHeadingElement>): React.ReactElement => (
		<h4 className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />
	),
	h5: ({ className, ...props }: React.HTMLProps<HTMLHeadingElement>): React.ReactElement => (
		<h5 className={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)} {...props} />
	),
	h6: ({ className, ...props }: React.HTMLProps<HTMLHeadingElement>): React.ReactElement => (
		<h6 className={cn("mt-8 scroll-m-20 text-base font-semibold tracking-tight", className)} {...props} />
	),
	a: ({ className, ...props }: React.HTMLProps<HTMLAnchorElement>): React.ReactElement => (
		<a className={cn("font-medium underline underline-offset-4", className)} {...props} />
	),
	p: ({ className, ...props }: React.HTMLProps<HTMLParagraphElement>): React.ReactElement => (
		<p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
	),
	ul: ({ className, ...props }: React.HTMLProps<HTMLUListElement>): React.ReactElement => (
		<ul className={cn("mt-2 ml-6", className)} {...props} />
	),
	ol: ({ className, ...props }: React.HTMLProps<HTMLOListElement>): React.ReactElement => (
		// @ts-expect-error - Missing properties
		<ol className={cn("mt-2 ml-6", className)} {...props} />
	),
	li: ({ children, className, ...props }: React.HTMLProps<HTMLLIElement>): React.ReactElement => {
		// if classname includes task-list-item, then add label for checkbox
		const firstChild = React.Children.toArray(children)[0] as React.ReactElement;
		const isCheckbox =
			firstChild?.type === "input" &&
			(firstChild?.props as React.InputHTMLAttributes<HTMLInputElement>)?.type === "checkbox";
		if (className?.includes("task-list-item") && isCheckbox) {
			return (
				<li className={cn("my-2", className)} {...props}>
					<input
						type="checkbox"
						className="border-muted bg-primary text-primary-foreground mr-2 h-3 w-3 rounded-lg"
						{...(firstChild?.props ?? {})}
						aria-label="checkbox"
					/>
					{React.Children.map(children, (child) => {
						if (React.isValidElement(child) && child.type === "input") {
							return null;
						}
						return child;
					})}
				</li>
			);
		}
		return (
			<li className={cn("my-2", className)} {...props}>
				{children}
			</li>
		);
	},
	blockquote: ({ className, ...props }: React.HTMLProps<HTMLElement>): React.ReactElement => (
		// @ts-expect-error - Missing properties
		<blockquote className={cn("[&>*]:text-muted-foreground mt-6 border-l-2 pl-6 italic", className)} {...props} />
	),
	img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>): React.ReactElement => (
		// eslint-disable-next-line @next/next/no-img-element
		<img className={cn("rounded-md border", className)} alt={alt} {...props} />
	),
	hr: ({ ...props }: React.HTMLProps<HTMLHRElement>): React.ReactElement => (
		<hr className="my-4 md:my-8" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>): React.ReactElement => (
		<div className="my-6 w-full overflow-y-auto">
			<table className={cn("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>): React.ReactElement => (
		<tr className={cn("even:bg-muted m-0 border-t p-0", className)} {...props} />
	),
	th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>): React.ReactElement => (
		<th
			className={cn(
				"border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
				className
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>): React.ReactElement => (
		<td
			className={cn(
				"border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className
			)}
			{...props}
		/>
	),
	pre: Pre,
	code: ({ className, ...props }: React.HTMLProps<HTMLElement>): React.ReactElement => {
		return (
			<code
				className={cn("bg-muted relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm", className)}
				{...props}
			/>
		);
	},
	dl: ({ className, ...props }: React.HTMLProps<HTMLElement>): React.ReactElement => (
		// @ts-expect-error - Missing properties
		<dl className={cn("mt-6", className)} {...props} />
	),
	dt: ({ className, ...props }: React.HTMLProps<HTMLElement>): React.ReactElement => (
		<dt className={cn("font-semibold", className)} {...props} />
	),
	mermaid: Mermaid,
	Hightlight: ({ className, ...props }: React.HTMLProps<HTMLElement>): React.ReactElement => (
		<mark className={cn("bg-accent text-accent-foreground", className)} {...props} />
	),
	Image: ResponsiveImage,
	Alert,
	Kbd,
};

export async function CustomMDX(props: {
	source: string;
	components?: MDXComponents;
	addToc?: boolean;
}): Promise<React.ReactElement> {
	const body = await mdSerialize(props.source, { ...components, ...(props.components || {}) }, props.addToc);
	return <>{body.content}</>;
}
