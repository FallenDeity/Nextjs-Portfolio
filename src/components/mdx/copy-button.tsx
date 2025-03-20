"use client";

import { Check, Clipboard } from "lucide-react";
import React, { DetailedHTMLProps, HTMLAttributes, useRef, useState } from "react";
import { toast } from "sonner";

export default function Pre({
	children,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>): React.ReactElement {
	const [isCopied, setIsCopied] = useState(false);
	const preRef = useRef<HTMLPreElement>(null);

	const handleClickCopy = async (): Promise<void> => {
		const code = preRef.current?.textContent;

		if (code) {
			await navigator.clipboard.writeText(code);
			toast.success("Copied to clipboard");
			setIsCopied(true);

			setTimeout(() => {
				setIsCopied(false);
			}, 3000);
		}
	};

	return (
		<pre ref={preRef} {...props} className="group relative mt-6 mb-4 overflow-x-auto rounded-lg border p-2">
			<button
				disabled={isCopied}
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onClick={handleClickCopy}
				className="absolute top-2 right-2 z-10 size-6 cursor-pointer opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
				{isCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
			</button>
			{children}
		</pre>
	);
}
