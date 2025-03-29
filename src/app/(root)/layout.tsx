import React from "react";

import MainLayout from "@/components/main-layout";
import { metadataConfig, viewportConfig } from "@/lib/metadata";

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return <MainLayout>{children}</MainLayout>;
}
