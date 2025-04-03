import { createFileRoute } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime"
import { SimpleDate } from "../../components/date"
import { useEffect, useRef } from "react"
import { highlightEffect } from "../../lib/highlightEffect"
import { queryClient } from "../../lib/queryClient"
import { retailOrderHistoryQuery } from "../../lib/dataLoading"
import { useSuspenseQuery } from "@tanstack/react-query"

const dropUndefinedSearchParams = <T extends Record<string, unknown>>(
	obj: T,
) => {
	const result = {} as Partial<T>
	for (const key in obj) {
		if (obj[key] !== undefined && obj[key] !== "") {
			result[key] = obj[key]
		}
	}
	return result
}

export const Route = createFileRoute("/orders/retail")({
	component: RouteComponent,
	pendingComponent: () => <div>Papa parse-ing:...</div>,
	validateSearch: (search: Record<string, unknown> | undefined) => {
		if (search === undefined) return {}
		return {
			amount: search?.amount as string | undefined,
			year: search?.year as string | undefined,
		}
	},
	loader: () => queryClient.ensureQueryData(retailOrderHistoryQuery),
})

function OrderDetailsLink({
	orderId,
	children,
}: {
	orderId: string
	children: React.ReactNode
}) {
	return (
		<a
			href={`https://www.amazon.com/gp/your-account/order-details?orderID=${orderId}`}
			target="_blank"
			className="underline tabular-nums"
		>
			{children}
		</a>
	)
}

function RouteComponent() {
	const { data } = useSuspenseQuery(retailOrderHistoryQuery)
	const { amount = "", year = "" } = Route.useSearch()
	const setSearch = Route.useNavigate()

	const setAmount = (amount: string) => {
		setSearch({
			search: (current) => dropUndefinedSearchParams({ ...current, amount }),
		})
	}

	const setYear = (year: string) => {
		setSearch({
			search: (current) => dropUndefinedSearchParams({ ...current, year }),
		})
	}

	const list = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!list.current) return
		list.current
			.querySelectorAll("[data-order-total]")
			.forEach(highlightEffect(amount))
	}, [list, amount])

	const filteredData = data
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
				(needsAmount ? amountMatch : true) && (needsYear ? yearMatch : true)
			)
		})
		.sort((a, b) => {
			if (amount === undefined || amount === "") return 0

			if (a.total === amount && b.total !== amount) return -1
			if (a.total !== amount && b.total === amount) return 1

			if (amount.includes(".")) {
				if (
					parseFloat(a.total).toFixed(2) === parseFloat(amount).toFixed(2) &&
					parseFloat(b.total).toFixed(2) !== parseFloat(amount).toFixed(2)
				)
					return -1
				if (
					parseFloat(a.total).toFixed(2) !== parseFloat(amount).toFixed(2) &&
					parseFloat(b.total).toFixed(2) === parseFloat(amount).toFixed(2)
				)
					return 1
			} else {
				const aFlooredMatch = Math.floor(parseFloat(a.total)) === Number(amount)
				const bFlooredMatch = Math.floor(parseFloat(b.total)) === Number(amount)
				if (aFlooredMatch && !bFlooredMatch) return -1
				if (bFlooredMatch && !aFlooredMatch) return 1

				const aFlooredContains = Math.floor(parseFloat(a.total))
					.toString()
					.includes(amount)
				const bFlooredContains = Math.floor(parseFloat(b.total))
					.toString()
					.includes(amount)
				if (aFlooredContains && !bFlooredContains) return -1
				if (bFlooredContains && !aFlooredContains) return 1
			}

			return 0
		})

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
						onChange={(e) => {
							setAmount(e.currentTarget.value)
							const inputEl = e.currentTarget
							setTimeout(() => {
								// After a delay, select all the text in the input, ready for the user's next query

								if (inputEl) {
									inputEl.select()
								}
							}, 3000)
						}}
						inputMode="numeric"
						pattern="[0-9.,]*"
					/>
				</label>
				<label className="flex gap-2">
					<div className="w-32">Year </div>
					<input
						className="inline-block border border-neutral-400 p-1 rounded"
						value={year}
						onChange={(e) => setYear(e.currentTarget.value)}
						type="number"
					/>
				</label>
			</div>

			<div
				ref={list}
				className="mt-4 grid grid-cols-[auto_auto_auto_auto] gap-x-8"
			>
				{filteredData.map((order) => {
					const giftCardUsed = order.items.some((x) => x.giftCardUsed)
					const cancelled = order.items.some(
						(x) => x["Order Status"] === "Cancelled",
					)
					const multiLine = order.items.length > 1 || giftCardUsed || cancelled
					return (
						<Fragment key={order.id}>
							<div className="grid col-span-4 grid-cols-subgrid odd:bg-blue-50 dark:odd:bg-blue-900 py-2 -mx-(--xPad) px-(--xPad)">
								<SimpleDate date={order.items[0].localDate} />
								<div>
									<OrderDetailsLink orderId={order.id}>
										...{order.id.split("-").at(-1)}
									</OrderDetailsLink>
								</div>
								<p className="text-right flex justify-between tabular-nums">
									<span className="opacity-20 dark:opacity-50">$</span>
									<span data-order-total>{order.total}</span>
								</p>
								<p>
									{multiLine ?
										<>
											{cancelled && (
												<span className="inline-block bg-red-200 rounded-full text-sm px-2 border border-red-500 dark:bg-red-800 dark:border-red-300">
													This order was cancelled.
												</span>
											)}
											{giftCardUsed && (
												<span className="inline-block bg-purple-200 dark:bg-purple-800 dark:border-purple-300 rounded-full text-sm px-2 border border-purple-500 ">
													A gift card was used on this order.{" "}
													<OrderDetailsLink orderId={order.id}>
														Check the order details
													</OrderDetailsLink>{" "}
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
												<span className="opacity-20 dark:opacity-50">$</span>
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
