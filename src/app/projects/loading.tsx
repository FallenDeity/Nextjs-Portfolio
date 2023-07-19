import React from "react";

export default function Loading(): React.JSX.Element {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<div className="spinner">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
