import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY, PROJECTS_QUERY } from "@/sanity/lib/queries";

const posts = await sanityFetch({
	query: POSTS_QUERY,
	params: { search: "", tags: [] },
	tags: ["post", "author", "category"],
});

const projects = await sanityFetch({
	query: PROJECTS_QUERY,
	tags: ["project", "category"],
});

const commonPaths = ["", "projects", "blog", "blog/rss.xml", "pings", "pings/rss.xml"];
const postPaths = posts.filter((post) => post.slug?.current).map((post) => `blog/${post.slug?.current}`);
const projectPaths = projects
	.filter((project) => project.slug?.current)
	.map((project) => `projects/${project.slug?.current}`);
export const allPaths = [...commonPaths, ...postPaths, ...projectPaths].map(
	(path) => `${process.env.NEXT_PUBLIC_URL}/${path}`
);
