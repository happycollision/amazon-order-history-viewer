import { Outlet, createRootRoute, Link } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export const Route = createRootRoute({
	component: () => (
		<>
			<header className="bg-red-300">
				<div>Linx</div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/upload">Upload</Link>
						</li>
					</ul>
				</nav>
			</header>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
})
