export function convertDateFromUtcToLocalTime(date: Date) {
	const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
	return localTime
}
