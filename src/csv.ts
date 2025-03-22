import { parse } from "papaparse"

export function loadCsv<Row>(url: string) {
	return new Promise<Row[]>((resolve) => {
		parse<Row>(url, {
			download: true,
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				resolve(results.data)
			},
		})
	})
}
