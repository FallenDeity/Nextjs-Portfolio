import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
    *[_type == "post"
    && defined(slug.current)
    && (!defined($search) || $search == "" || (title match $search || body match $search))
    && (!defined($tags) || count($tags) == 0 || array::intersects(categories[]->slug.current, $tags))
    ] | order(publishedAt desc) {
        _id, title, slug, publishedAt, mainImage, excerpt, author->{name, image}, categories[]->{title, slug, description}
    }`);

export const POST_QUERY = defineQuery(`
    *[_type == "post" && defined(slug.current) && slug.current == $slug][0] {
        _id, title, slug, publishedAt, mainImage, author->{name, image}, categories[]->{title, slug, description}, body
    }`);

export const PREV_NEXT_POSTS_QUERY = defineQuery(`
    *[_type == "post" && defined(slug.current) && slug.current == $slug][0] {
        "prev": *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt < ^.publishedAt]
            | order(publishedAt desc)[0] {
                _id, title, slug, excerpt, publishedAt
        },
        "next": *[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt > ^.publishedAt]
            | order(publishedAt asc)[0] {
                _id, title, slug, excerpt, publishedAt
        }
    }
`);

export const RECENT_POSTS_QUERY = defineQuery(`
    *[_type == "post" && defined(slug.current)] | order(_createdAt desc)[0...$limit] {
        _id, title, slug, publishedAt, mainImage, categories[]->{title, slug, description}, excerpt, author->{name, image}
    }`);

export const CATEGORIES_QUERY = defineQuery(`
    *[_type == "category"] {
        _id, title, slug, description
    }`);

export const PROFILE_QUERY = defineQuery(`
    *[_type == "profile"][0] {
        name,
        caption,
        bio,
        image,
        languages,
        resume,
        contact,
        education[]->{institution, degree, startDate, endDate, description, icon},
        experience[]->{_id, company, role, startDate, endDate, description, points, icon, subExperiences[]->{_id, company, role, startDate, endDate, description, points, icon}},
        projects[]->{title, slug, image},
        technologies,
        _updatedAt
    }`);

export const PROJECTS_QUERY = defineQuery(`
    *[_type == "project"] | order(publishedAt desc) {
        _id, slug, title, description, excerpt, tags[]->{title, slug, description}, publishedAt, source, demo, image, features, screenshots, technologies, featured
    }`);

export const PROJECT_QUERY = defineQuery(`
    *[_type == "project" && defined(slug.current) && slug.current == $slug][0] {
        _id, slug, title, description, excerpt, tags[]->{title, slug, description}, publishedAt, source, demo, image, features, screenshots, technologies, featured
    }`);

export const NEXT_PREV_PROJECTS_QUERY = defineQuery(`
    *[_type == "project" && defined(slug.current) && slug.current == $slug][0] {
        "prev": *[_type == "project" && defined(slug.current) && defined(publishedAt) && publishedAt < ^.publishedAt]
            | order(publishedAt desc)[0] {
                _id, slug, title, excerpt, publishedAt
        },
        "next": *[_type == "project" && defined(slug.current) && defined(publishedAt) && publishedAt > ^.publishedAt]
            | order(publishedAt asc)[0] {
                _id, slug, title, excerpt, publishedAt
        }
    }
`);
