import { createFileRoute } from "@tanstack/react-router"
import { loadCsv } from "../../csv"
import { convertDateFromUtcToLocalTime } from "../../lib/date"
import { Fragment } from "react/jsx-runtime"
import { SimpleDate } from "../../components/date"

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

				giftCardUsed: row["Payment Instrument Type"].includes(
					"Gift Certificate/Card",
				),
			}
		})

		const finalOrders = new Map<string, typeof enhancedData>()

		for (const row of enhancedData) {
			if (!finalOrders.has(row["Order ID"])) {
				finalOrders.set(row["Order ID"], [row])
			} else {
				finalOrders.get(row["Order ID"])?.push(row)
			}
		}

		return [...finalOrders].map(([id, rows]) => ({
			id,
			items: rows,
			total: rows
				.reduce((acc, row) => acc + parseFloat(row.amount), 0)
				.toFixed(2),
		}))
	},
})

function RouteComponent() {
	const data = Route.useLoaderData()
	return (
		<div className="[--xPad:--spacing(4)] py-8 px-(--xPad)">
			<h1>Retail Order History</h1>
			<div className="mt-4 grid grid-cols-[auto_auto_auto] gap-x-8">
				{data.map((order) => (
					<Fragment key={order.id}>
						<div className="grid col-span-3 grid-cols-subgrid odd:bg-amber-100 -mx-(--xPad) px-(--xPad) has-[[data-suss]]:bg-purple-200">
							<SimpleDate date={order.items[0].localDate} />
							<p className="text-right flex justify-between tabular-nums">
								<span className="opacity-20">$</span>
								{order.total}
							</p>
							<p>
								{order.items.length > 1 ?
									<>
										{order.items.some((x) => x.giftCardUsed) && (
											<span>
												A gift card was used on this order.{" "}
												<a
													href={`https://www.amazon.com/gp/css/summary/print.html?orderID=${order.id}`}
													target="_blank"
													className="underline"
												>
													Check the invoice for the actual total.
												</a>
											</span>
										)}
									</>
								:	order.items[0]["Product Name"]}
							</p>
							{order.items.length < 2 ?
								""
							:	order.items.map((item) => (
									<div
										className="grid-cols-subgrid grid col-span-3"
										data-suss={item.giftCardUsed || undefined}
										key={item.id}
									>
										<p></p>
										<p className="text-right flex justify-between tabular-nums">
											<span className="opacity-20">$</span>
											{item.amount}
										</p>
										<p>{item["Product Name"]}</p>
									</div>
								))
							}
						</div>
					</Fragment>
				))}
			</div>
		</div>
	)
}
