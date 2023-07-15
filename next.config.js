/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let images = {
	remotePatterns: [
		{
			protocol: "https",
			hostname: "**",
		},
	],
};
if (isGithubActions) {
	images = {
		loader: "imgix",
		path: "https://personal-2066.imgix.net/",
	};
}

const nextConfig = {
	images: images,
	reactStrictMode: true,
	distDir: "dist",
};

if (isGithubActions) {
	nextConfig["output"] = "export";
}

module.exports = nextConfig;
