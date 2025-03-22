import { createFileRoute } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime"
import { loadCsv } from "../csv"

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => <div>Papa parse-ing:...</div>,
	loader: async () => {
		const data = await loadCsv<{ "File name": string; Description: string }>(
			"/orders/FileDescriptions.csv",
		)
		// File names are not unique, probably because Amazon's descriptions are wrong.
		return data.map((row, i) => ({ id: row["File name"] + i, ...row }))
	},
})

function App() {
	const data = Route.useLoaderData()
	return (
		<div className="grid grid-cols-2 gap-4 p-4">
			{data.map((row) => (
				<Fragment key={row.id}>
					<h2>{row["File name"]}</h2>
					<p>{row.Description}</p>
				</Fragment>
			))}
		</div>
	)
}
