import { createFileRoute } from "@tanstack/react-router"
import { loadCsv } from "../../csv"
import { convertDateFromUtcToLocalTime } from "../../lib/date"

export const Route = createFileRoute("/orders/retail")({
	component: RouteComponent,
	pendingComponent: () => <div>Papa parse-ing:...</div>,
	loader: async () => {
		const allIds = new Set<string>()
		const repeatedIds = new Set<string>()
		const data = await loadCsv<{
			Website: string
			"Order ID": string
			"Order Date": string
			"Purchase Order Number": string
			Currency: string
			"Unit Price": string
			"Unit Price Tax": string
			"Shipping Charge": string
			"Total Discounts": string
			"Total Owed": string
			"Shipment Item Subtotal": string
			"Shipment Item Subtotal Tax": string
			ASIN: string
			"Product Condition": string
			Quantity: string
			"Payment Instrument Type": string
			"Order Status": string
			"Shipment Status": string
			"Ship Date": string
			"Shipping Option": string
			"Shipping Address": string
			"Billing Address": string
			"Carrier Name & Tracking Number": string
			"Product Name": string
			"Gift Message": string
			"Gift Sender Name": string
			"Gift Recipient Contact Details": string
			"Item Serial Number": string
		}>("/orders/Retail.OrderHistory.1/Retail.OrderHistory.1.csv")
		const enhancedData = data.map((row, i) => {
			if (allIds.has(row["Order ID"])) {
				repeatedIds.add(row["Order ID"])
			}
			allIds.add(row["Order ID"])

			const t = row["Total Owed"]
			const amount = t.includes(".") ? t : t + ".00"

			return {
				...row,
				id: row["Order ID"] + i,
				localDate: convertDateFromUtcToLocalTime(new Date(row["Order Date"])),

				amount: amount
					.split(".")
					.map((x, i) => (i === 1 ? x.padEnd(2, "0") : x))
					.join("."),

				dupeId: false,
			}
		})

		for (const row of enhancedData) {
			if (repeatedIds.has(row["Order ID"])) {
				row.dupeId = true
			}
		}

		return enhancedData
	},
})

function RouteComponent() {
	const data = Route.useLoaderData()
	return (
		<div className="[--xPad:--spacing(4)] py-8 px-(--xPad)">
			<h1>Retail Order History</h1>
			<div className="mt-4 grid grid-cols-[auto_auto_auto_auto] gap-x-8">
				{data.map((row) => (
					<div
						className="grid col-span-4 grid-cols-subgrid odd:bg-amber-100 -mx-(--xPad) px-(--xPad)"
						key={row.id}
					>
						<p className="tabular-nums">{row.dupeId ? row["Order ID"] : ""}</p>
						<p className="flex gap-1 justify-between">
							{row.localDate
								.toLocaleDateString()
								.split("/")
								.map((x, i) => (
									<span key={i}>{x}</span>
								))}
						</p>
						<p className="text-right flex justify-between tabular-nums">
							<span className="opacity-20">$</span>
							{row.amount}
						</p>
						<p>{row["Product Name"]}</p>
					</div>
				))}
			</div>
		</div>
	)
}
