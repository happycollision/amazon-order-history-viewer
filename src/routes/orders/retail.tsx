import { createFileRoute } from "@tanstack/react-router"
import { loadCsv } from "../../csv"
import { convertDateFromUtcToLocalTime } from "../../lib/date"
import { Fragment } from "react/jsx-runtime"
import { SimpleDate } from "../../components/date"
import { useState } from "react"

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

function InvoiceLink({
	orderId,
	children,
}: {
	orderId: string
	children: React.ReactNode
}) {
	return (
		<a
			href={`https://www.amazon.com/gp/css/summary/print.html?orderID=${orderId}`}
			target="_blank"
			className="underline tabular-nums"
		>
			{children}
		</a>
	)
}

function RouteComponent() {
	const data = Route.useLoaderData()
	const [amount, setAmount] = useState(undefined as string | undefined)
	const [year, setYear] = useState(undefined as string | undefined)
	return (
		<div className="[--xPad:--spacing(4)] py-8 px-(--xPad)">
			<h1 className="text-2xl">Retail Order History</h1>

			<div className="flex flex-col gap-2">
				<header>Filters:</header>
				<label className="flex gap-2">
					<div className="w-32">Order amount </div>
					<input
						className="inline-block border border-neutral-400 p-1 rounded"
						value={amount}
						onInput={(e) => setAmount(e.currentTarget.value)}
						inputMode="numeric"
						pattern="[0-9.,]*"
					/>
				</label>
				<label className="flex gap-2">
					<div className="w-32">Year </div>
					<input
						className="inline-block border border-neutral-400 p-1 rounded"
						value={year}
						onInput={(e) => setYear(e.currentTarget.value)}
						type="number"
					/>
				</label>
			</div>

			<div className="mt-4 grid grid-cols-[auto_auto_auto_auto] gap-x-8">
				{data
					.filter((order) => {
						const needsYear = year !== undefined
						let yearMatch = true
						const needsAmount = amount !== undefined
						let amountMatch = true

						if (needsAmount) {
							{
								if (order.items.some((x) => x.giftCardUsed)) {
									amountMatch = parseFloat(order.total) <= parseFloat(amount)
								}
								amountMatch = order.total.includes(amount)
							}
						}

						if (needsYear) {
							yearMatch = order.items[0].localDate
								.getFullYear()
								.toString()
								.includes(year)
						}

						return (
							(needsAmount ? amountMatch : true) &&
							(needsYear ? yearMatch : true)
						)
					})
					.map((order) => {
						const giftCardUsed = order.items.some((x) => x.giftCardUsed)
						const cancelled = order.items.some(
							(x) => x["Order Status"] === "Cancelled",
						)
						const multiLine =
							order.items.length > 1 || giftCardUsed || cancelled
						return (
							<Fragment key={order.id}>
								<div className="grid col-span-4 grid-cols-subgrid odd:bg-blue-50 py-2 -mx-(--xPad) px-(--xPad)">
									<SimpleDate date={order.items[0].localDate} />
									<InvoiceLink orderId={order.id}>
										...{order.id.split("-").at(-1)}
									</InvoiceLink>
									<p className="text-right flex justify-between tabular-nums">
										<span className="opacity-20">$</span>
										{order.total}
									</p>
									<p>
										{multiLine ?
											<>
												{cancelled && (
													<span className="inline-block bg-red-200 rounded-full text-sm px-2 border border-red-500 ">
														This order was cancelled.
													</span>
												)}
												{giftCardUsed && (
													<span className="inline-block bg-purple-200 rounded-full text-sm px-2 border border-purple-500 ">
														A gift card was used on this order.{" "}
														<InvoiceLink orderId={order.id}>
															Check the invoice
														</InvoiceLink>{" "}
														for the actual total.
													</span>
												)}
											</>
										:	order.items[0]["Product Name"]}
									</p>
									{multiLine &&
										order.items.map((item) => (
											<div
												className="grid-cols-subgrid grid col-span-4"
												key={item.id}
											>
												<p></p>
												<p></p>
												<p className="text-right flex justify-between tabular-nums">
													<span className="opacity-20">$</span>
													{item.amount}
												</p>
												<p>{item["Product Name"]}</p>
											</div>
										))}
								</div>
							</Fragment>
						)
					})}
			</div>
		</div>
	)
}
