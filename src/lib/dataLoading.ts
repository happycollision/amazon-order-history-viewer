import { queryOptions } from "@tanstack/react-query"
import { convertDateFromUtcToLocalTime } from "./date"
import { loadCsv } from "../csv"

async function loadRetailData() {
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
}

export const retailOrderHistoryQuery = queryOptions({
	queryKey: ["retailOrderHistory"],
	queryFn: loadRetailData,
})
