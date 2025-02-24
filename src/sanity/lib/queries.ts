import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{
    _id, title, slug, author, publishedAt, mainImage, categories, body
}`);
