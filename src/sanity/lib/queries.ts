import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
    *[_type == "post"
    && defined(slug.current)
    && (!defined($search) || $search == "" || (title match $search || body match $search))
    && (!defined($tags) || count($tags) == 0 || count((categories[]->slug.current)[@ in $tags]) > 0)]
    {
        _id, title, slug, author, publishedAt, mainImage, categories, body
    }`);

export const POST_QUERY = defineQuery(`
    *[_type == "post" && slug.current == $slug] {
        _id, title, slug, author, publishedAt, mainImage, categories, body
    }`);

export const RECENT_POSTS_QUERY = defineQuery(`
    *[_type == "post" && defined(slug.current)] | order(_createdAt desc)[0...$limit] {
        _id, title, slug, author, publishedAt, mainImage, categories, body
    }`);

export const CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] {
        _id, title, slug, description
    }`);
