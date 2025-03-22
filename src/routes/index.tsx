import { createFileRoute } from "@tanstack/react-router"
import { parse } from "papaparse"
import { Fragment } from "react/jsx-runtime"

function loadCsv<Row>(url: string) {
	return new Promise<Row[]>((resolve) => {
		parse<Row>(url, {
			download: true,
			header: true,
			complete: (results) => {
				resolve(results.data)
			},
		})
	})
}

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <div>Papa parse-ing:...</div>,
	loader: async () => {
		const data = await loadCsv<{ "File name": string; Description: string }>(
			"/orders/FileDescriptions.csv",
		)
		return data
	},
})

function App() {
	const data = Route.useLoaderData()
	return (
		<div className="grid grid-cols-2 gap-4 p-4">
			{data.map((row) => (
				<Fragment key={row["File name"]}>
					<h2>{row["File name"]}</h2>
					<p>{row.Description}</p>
				</Fragment>
			))}
		</div>
	)
}
