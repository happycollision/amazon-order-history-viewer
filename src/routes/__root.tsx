import { Outlet, createRootRoute, Link } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export const Route = createRootRoute({
	component: () => (
		<>
			<header className="bg-red-300 dark:bg-red-700">
				<nav>
					<ul className="flex gap-4 [&>li>a]:p-4 [&>li>a]:inline-block  [&>li>a]:hover:bg-red-400 [&>li>a[data-status=active]]:bg-red-400 [&>li>a[data-status=active]]:text-white">
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/orders/retail">Retail Order History</Link>
						</li>
						<li>
							<Link to="/upload">Upload (TBD)</Link>
						</li>
					</ul>
				</nav>
			</header>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
})
