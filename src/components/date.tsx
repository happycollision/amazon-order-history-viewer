export function SimpleDate(p: { date: Date }) {
	const [month, day, year] = p.date.toLocaleDateString().split("/")
	return (
		<span className="inline-flex justify-between tabular-nums gap-[2px]">
			<span className="w-[2ch] text-center">{month}</span>/
			<span className="w-[2ch] text-center">{day}</span>/<span>{year}</span>
		</span>
	)
}
