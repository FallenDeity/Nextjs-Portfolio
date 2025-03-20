import "@/styles/blog.css";

// import { getImageDimensions } from "@sanity/asset-utils";
// import { formatDistanceToNow } from "date-fns";
// import Image from "next/image";
// import { redirect } from "next/navigation";
import React from "react";

import { CustomMDX } from "@/components/mdx/mdx-remote";
import { sanityFetch } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const posts = await sanityFetch({
		query: POSTS_QUERY,
		params: { search: "", tags: [] },
		revalidate: false,
	});

	const slugs = posts.map((post) => post.slug?.current || "").filter((slug) => slug);

	return slugs.map((slug) => ({ slug }));
}

// @ts-expect-error unused variable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Page({ params }: { params: Promise<{ slug: string }> }): React.ReactElement {
	// const { slug } = await params;
	// const post = await sanityFetch({
	// 	query: POST_QUERY,
	// 	params: { slug: slug },
	// 	tags: [`post:${slug}`, "author", "category"],
	// });

	// if (!post) {
	// 	return redirect("/404");
	// }

	const markdownBody = `
	# H1
	## H2
	### H3
	#### H4
	##### H5
	###### H6

	This is an example of multiple definitions for a single term.

	Indent
	: (*noun*) A whitespace to align text in a beautiful way.
	: (*verb*) To add whitespace to make ugly code beautiful.

	**Bold**
	*Italic*
	~~Strikethrough~~
	<ins>Underline</ins>
	**This text is _extremely_ important**
	***All this text is important***
	This is a <sub>subscript</sub> text
	This is a <sup>superscript</sup> text
	> Text that is a quote
	Use \`git status\` to list all new or modified files that haven't yet been committed.

	Some basic Git commands are:
	\`\`\`bash caption="Basic Git Commands"
	git status
	git add
	git commit
	\`\`\`

	\`\`\`javascript showLineNumbers title="main.js" {1,2} /foo/
	const foo = "bar";
	console.log(foo);

	// This is a comment

	function baz() {
		return foo;
	}

	baz();
	\`\`\`

	The background color is \`#ffffff\` for light mode and \`#000000\` for dark mode.
	This site was built using [GitHub Pages](https://pages.github.com/).

	Lift($$L$$) can be determined by Lift Coefficient ($$C_L$$) like the following
	equation.

	\`\`\`math
	L = \\frac{1}{2} \\rho v^2 S C_L
	\`\`\`
	$$\\sqrt{a^2 + b^2}$$

	\`\`\`mermaid
	graph TD;
		A-->B;
		A-->C;
		B-->D;
		C-->D;
	\`\`\`

	# Section Heading

	Some body text of this section.

	<a name="my-custom-anchor-point"></a>
	Some text I want to provide a direct link to, but which doesn't have its own heading.

	(… more content…)

	[A link to that custom anchor](#my-custom-anchor-point)

	This example
	Will span two lines

	![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](https://myoctocat.com/assets/images/base-octocat.svg)

	- George Washington
	* John Adams
	+ Thomas Jefferson

	1. James Madison
	2. James Monroe
	3. John Quincy Adams
	4. John Adams
	5. Thomas Jefferson

	1. First list item
		- First nested list item
    		- Second nested list item

	- [x] #739
	- [ ] https://github.com/octo-org/octo-repo/issues/740
	- [ ] Add delight to the experience when all tasks are complete :tada:

	---

	<Alert type="note">
		<strong>Heads up!</strong> This alert needs your attention, but it's not super important.
	</Alert>

	<br />


	<Alert type="tip">
		<strong>Pro tip:</strong> This alert needs your attention, but it's not super important.
		Here is my *pro* tip.
	</Alert>

	<br />


	<Alert type="important">
		<strong>Important:</strong> This alert needs your attention, but it's not super important.
	</Alert>

	<br />


	<Alert type="warning">
		<strong>Warning:</strong> This alert needs your attention, but it's not super important.
	</Alert>

	<br />

	<Alert type="caution">
		<strong>Caution:</strong> This alert needs your attention, but it's not super important.
	</Alert>

	---

	Colons can be used to align columns.

	| Tables        | Are           | Cool  |
	| ------------- |:-------------:| -----:|
	| col 3 is      | right-aligned | $1600 |
	| col 2 is      | centered      |   $12 |
	| zebra stripes | are neat      |    $1 |

	There must be at least 3 dashes separating each header cell.
	The outer pipes (|) are optional, and you don't need to make the
	raw Markdown line up prettily. You can also use inline Markdown.

	Markdown | Less | Pretty
	--- | --- | ---
	*Still* | \`renders\` | **nicely**
	1 | 2 | 3

	---

	I need to highlight these <Hightlight>very important words</Hightlight> in a sentence.

	<Kbd keys={["command"]}>K</Kbd>
	<Kbd keys={["command", "shift"]}>N</Kbd>
	<Kbd keys={["option", "command"]}>P</Kbd>

	Here is a simple footnote[^1].

	A footnote can also have multiple lines[^2].

	[^1]: My reference.
	[^2]: To add line breaks within a footnote, prefix new lines with 2 spaces.
	This is a second line.
	`;
	return (
		<article className="bg-card/40 m-6 mx-auto mb-36 min-h-screen max-w-3xl transform-gpu overflow-hidden rounded-lg [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] backdrop-blur-xl backdrop-filter dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]">
			{/* <link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
				integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
				crossOrigin="anonymous"
			/> */}
			{/* <Image
				priority
				className="h-96 max-h-96 w-full rounded-lg object-cover"
				src={urlFor(post.mainImage).url() || ""}
				alt={post.mainImage.alt || "Image"}
				width={getImageDimensions(post.mainImage.asset?._ref ?? "").width}
				height={getImageDimensions(post.mainImage.asset?._ref ?? "").height}
			/> */}
			{/* <section className="flex flex-row items-center justify-between p-4">
				<div className="flex flex-row items-center gap-2">
					<Image
						src={urlFor(post.author.image).width(56).height(56).url() || ""}
						alt={post.author.name}
						width={56}
						height={56}
						className="h-14 w-14 rounded-full"
					/>
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl font-bold">{post.title}</h1>
						<div className="flex flex-row gap-2">
							{post.categories.slice(0, 2).map((category) => (
								<span
									key={category.slug.current}
									className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
									{category.title}
								</span>
							))}
						</div>
					</div>
				</div>
				<div className="flex flex-row">
					<p className="text-muted-foreground text-sm">
						{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
					</p>
				</div>
			</section> */}
			<div className="p-4">
				<CustomMDX source={markdownBody} />
			</div>
		</article>
	);
}
