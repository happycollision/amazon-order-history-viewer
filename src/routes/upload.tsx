import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/upload")({
	component: Upload,
})

function Upload() {
	return (
		<div>
			Uploads will be supported soon. For now, you have to actually run this app
			locally and populate the csv files in the public/orders folder.
		</div>
	)
}
