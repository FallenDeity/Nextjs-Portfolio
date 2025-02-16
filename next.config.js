/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		turbo: {
			resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	devIndicators: {
		appIsrStatus: false,
	},
	reactStrictMode: true,
	distDir: "dist",
};

module.exports = nextConfig;
