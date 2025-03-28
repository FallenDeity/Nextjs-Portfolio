/** @type {import('next').NextConfig} */

import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
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
	reactStrictMode: false,
	distDir: "dist",
};

export default withBundleAnalyzer(nextConfig);
