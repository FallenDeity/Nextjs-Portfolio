import type { MetadataRoute } from "next";

import { allPaths } from "@/lib/all-routes";

export default function sitemap(): MetadataRoute.Sitemap {
	return allPaths.map((path) => ({
		url: path,
		lastModified: new Date(),
	}));
}
