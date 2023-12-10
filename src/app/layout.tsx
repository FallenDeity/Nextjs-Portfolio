import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en">
			<body style={{ margin: 0 }}>{children}</body>
		</html>
	);
}
