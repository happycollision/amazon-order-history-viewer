import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/orders/retail")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/orders/retail"!</div>
}
