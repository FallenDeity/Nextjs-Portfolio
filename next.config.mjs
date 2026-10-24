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
	outputFileTracingIncludes: {
		"/": ["./public/cat.webp"],
		"/blog/*": ["./public/**/*"],
		"/pings": ["./public/**/*"],
	},
	serverExternalPackages: ["pino", "pino-pretty"],
	images: {
		dangerouslyAllowSVG: false,
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
