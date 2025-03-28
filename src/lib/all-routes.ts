import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";

const posts = await sanityFetch({
	query: POSTS_QUERY,
	params: { search: "", tags: [] },
	revalidate: false,
});

const projects = await sanityFetch({
	query: PROJECTS_QUERY,
	revalidate: false,
});

const commonPaths = ["", "projects", "blog"];
const postPaths = posts.filter((post) => post.slug?.current).map((post) => `blog/${post.slug?.current}`);
const projectPaths = projects
	.filter((project) => project.slug?.current)
	.map((project) => `projects/${project.slug?.current}`);
export const allPaths = [...commonPaths, ...postPaths, ...projectPaths].map(
	(path) => `${process.env.NEXT_PUBLIC_URL}/${path}`
);
