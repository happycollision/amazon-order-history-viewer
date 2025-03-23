import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import reactCompiler from "eslint-plugin-react-compiler"

export default defineConfig([
	{ ignores: ["node_modules/**", "dist/**"] },
	{ files: ["./src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
	{
		files: ["./src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ["./src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: { js },
		extends: ["js/recommended"],
	},
	// @ts-expect-error // I don't know. It's wrong, but it ain't really.
	tseslint.configs.recommended,
	pluginReact.configs.flat["jsx-runtime"],
	{
		plugins: {
			// @ts-expect-error // I don't know. It's wrong, but it ain't really.
			"react-compiler": reactCompiler,
		},
		rules: {
			"react-compiler/react-compiler": "error",
		},
	},
])
