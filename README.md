# Blog resources

This branch holds supporting code and reference material for technical blog posts. It stays separate from the Next.js application branch, with post-specific resources organized under `blog-resources/`.

## Current collections

- [`blog-resources/lgpe/`](blog-resources/lgpe/) contains the Python parsers and renderers, their runtime helpers, and GLSL sources for the Let's Go, Pikachu! reverse-engineering post. Setup instructions and dependencies are listed in [`requirements-render.txt`](blog-resources/lgpe/scripts/requirements-render.txt).

## Adding resources

Keep each post's scripts and reference files in its own folder under `blog-resources/`. Include the dependencies needed by those scripts and document their inputs and provenance here or alongside the collection.
