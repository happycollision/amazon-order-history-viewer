import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <div>Papa parse-ing:...</div>,
})

function App() {
	return (
		<div>
			This page used to house some Amazon file descriptions. Instead, it will
			become instructions for using the app... soon.
		</div>
	)
}
