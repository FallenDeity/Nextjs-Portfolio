import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: new Date().toISOString().slice(0, 10),
	useCdn: true,
	token: process.env.SANITY_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: string): ReturnType<typeof builder.image> {
	return builder.image(source);
}
