/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = "";
let basePath = "";
let images = {
	remotePatterns: [
		{
			protocol: "https",
			hostname: "**",
		},
	],
};
if (isGithubActions) {
	const repoName = process.env.GITHUB_REPOSITORY.replace(/.*\//, "");
	assetPrefix = `/${repoName}/`;
	basePath = `/${repoName}`;
	images = {
		loader: "imgix",
		path: "https://personal-2066.imgix.net/",
	};
}

const nextConfig = {
	assetPrefix: assetPrefix,
	basePath: basePath,
	images: images,
	reactStrictMode: true,
	distDir: "dist",
};

if (isGithubActions) {
	nextConfig["output"] = "export";
}

module.exports = nextConfig;
