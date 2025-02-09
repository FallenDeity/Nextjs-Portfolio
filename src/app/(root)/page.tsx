import React from "react";

export default function Home(): React.JSX.Element {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-10">
			<div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-900">
				<h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Hello World!</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					This is a starter template for your next project.
				</p>
			</div>
		</div>
	);
}
