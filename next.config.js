/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
	experimental: {
		turbo: {
			resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
		},
	},
	transpilePackages: ["next-mdx-remote"],
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	serverExternalPackages: ["pino", "pino-pretty"],
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	reactStrictMode: true,
	distDir: "dist",
};

module.exports = withBundleAnalyzer(nextConfig);
