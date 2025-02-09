import React from "react";

import MainLayout from "@/components/main-layout";

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return <MainLayout>{children}</MainLayout>;
}
