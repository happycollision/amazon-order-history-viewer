/**
 * Finds the first match of the `match` text and wraps it in a span with the
 * `className` class.
 *
 * It is best to use a selector and target as close as possible to the text you
 * want to highlight. The example below shows how to use this effect with a ref
 * and a selector, but you could use this however you like in an effect. It
 * breaks out of React for direct dom manipulation.
 *
 * @example
 * function MyComponent({matchingText, items}) {
 *   const container = useRef(null)
 *
 *   useEffect(() => {
 *     if (!container.current) return
 *     container.querySelectorAll(".someSelector").forEach(highlightEffect(matchingText))
 *   }, []
 *
 *   return (<div ref={container}>{items.map((item,i) => {
 *     return <div key={i} className="someSelector">{item}</div>
 *   })}</div>)
 * }
 */
export const highlightEffect =
	(
		match: string,
		className = "bg-yellow-200 dark:bg-yellow-800 rounded-xs px-px -mx-px",
	) =>
	(el: Element | null | undefined) => {
		if (!el) return
		const text = el.textContent
		if (!text) return

		if (!match) {
			// Remove all previous highlights (because we are not inside React's
			// declarative world anymore)
			el.querySelectorAll("[data-highlight]").forEach((el) => {
				el.outerHTML = el.innerHTML
			})
			return
		}

		const index = text.indexOf(match)
		if (index === -1) return
		el.innerHTML =
			text.slice(0, index) +
			`<span data-highlight class="${className}">${text.slice(index, index + match.length)}</span>` +
			text.slice(index + match.length)
	}
