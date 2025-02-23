// src/components/DisableDraftMode.tsx

"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";
import React from "react";

export function DisableDraftMode(): React.ReactElement | null {
	const environment = useDraftModeEnvironment();

	// Only show the disable draft mode button when outside of Presentation Tool
	if (environment !== "live" && environment !== "unknown") {
		return null;
	}

	return (
		<a href="/api/draft-mode/disable" className="fixed right-4 bottom-4 z-50 border px-4 py-2">
			Disable Draft Mode
		</a>
	);
}
