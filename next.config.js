/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const images = {
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
		loader: "imgix",
		path: "",
	};
	nextConfig["assetPrefix"] = "./";
}

module.exports = nextConfig;
