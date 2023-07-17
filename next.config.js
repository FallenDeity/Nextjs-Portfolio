/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const images = {
	unoptimized: true,
	remotePatterns: [
		{
			protocol: "https",
			hostname: "**",
		},
	],
};

const nextConfig = {
	images: images,
	reactStrictMode: true,
	distDir: "dist",
};

if (isGithubActions) {
	nextConfig["output"] = "export";
	nextConfig["images"] = {
		unoptimized: true,
		loader: "imgix",
		path: "https://fallendeity.imgix.net",
	};
	nextConfig["assetPrefix"] = "./";
}

module.exports = nextConfig;
