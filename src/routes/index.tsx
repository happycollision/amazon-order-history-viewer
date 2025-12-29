import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <div>Papa parse-ing:...</div>,
})

function App() {
	return (
		<div>
			If the app is ever released with LocalStorage functionality, this page
			will have instructions about how to use the app. For now, check the README
			file to learn how to get your data into the app.
		</div>
	)
}
