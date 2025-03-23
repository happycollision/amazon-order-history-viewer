import { defineConfig } from "vite"
import viteReact from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		TanStackRouterVite({ autoCodeSplitting: true }),
		viteReact({
			babel: {
				plugins: [["babel-plugin-react-compiler", {}]],
			},
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
	},
})
