import { ClientReturn, ContentSourceMap, createClient, QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function sanityFetch<const QueryString extends string>({
	query,
	params = {},
	revalidate = 60, // default revalidation time in seconds
	tags = [],
}: {
	query: QueryString;
	params?: QueryParams;
	revalidate?: number | false;
	tags?: string[];
}): Promise<
	ClientReturn<QueryString, { data: ClientReturn<QueryString>; sourceMap: ContentSourceMap | null; tags: string[] }>
> {
	return client.fetch(query, params, {
		// @ts-expect-error - this is a valid option
		next: {
			revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
			tags, // for tag-based revalidation
		},
	});
}
