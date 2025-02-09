"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useEffect, useState } from "react";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>): React.ReactElement {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <> {children} </>; // Render children without ThemeProvider during SSR
	}
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
