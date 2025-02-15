/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: [
			"**/dist/",
			"**/node_modules/",
			"**/types/",
			"**/.gitignore",
			"**/LICENSE",
			"**/package-lock.json",
			"**/README.md",
			"**/webpack.config.ts",
			"**/postcss.config.js",
			"**/tailwind.config.js",
			"**/next.config.js",
			"**/next-env.d.ts",
		],
	},
	...compat.extends(
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/strict",
		"plugin:@next/next/recommended",
		"plugin:prettier/recommended"
	),
	{
		plugins: {
			"@typescript-eslint": typescriptEslint,
			prettier,
			"simple-import-sort": simpleImportSort,
			import: fixupPluginRules(_import),
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				...globals.node,
			},

			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",

			parserOptions: {
				project: "./tsconfig.json",
			},
		},

		rules: {
			"prettier/prettier": "error",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-duplicates": "error",
			"@typescript-eslint/array-type": "error",
			"@typescript-eslint/consistent-type-assertions": "error",
			"@typescript-eslint/consistent-type-definitions": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/no-empty-function": "error",
			"@typescript-eslint/no-empty-interface": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-inferrable-types": "error",
			"@typescript-eslint/no-misused-new": "error",
			"@typescript-eslint/no-namespace": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
			"@typescript-eslint/no-this-alias": "error",
			"@typescript-eslint/no-unused-vars": "error",
			"@typescript-eslint/no-var-requires": "error",
			"@typescript-eslint/prefer-namespace-keyword": "error",
			"@typescript-eslint/triple-slash-reference": "error",
			"no-var": "error",
			"prefer-const": "error",
		},
	},
];
