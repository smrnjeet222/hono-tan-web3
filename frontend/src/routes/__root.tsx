import type { TRootContext } from "@/main";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
	Link,
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import * as React from "react";

export const Route = createRootRouteWithContext<TRootContext>()({
	component: RootComponent,
});

const TanStackRouterDevtools =
	import.meta.env.MODE === "production"
		? () => null // Render nothing in production
		: React.lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			);

const TanstackQueryDevtools =
	import.meta.env.MODE === "production"
		? () => null
		: React.lazy(() =>
				import("@tanstack/react-query-devtools").then((res) => ({
					default: res.ReactQueryDevtools,
				})),
			);

function RootComponent() {
	return (
		<>
			<div className="p-2 flex gap-2 text-lg items-center">
				<Link
					to="/"
					className="[&.active]:font-bold"
					activeOptions={{ exact: true }}
				>
					Home
				</Link>
				<Link to="/jokes" className="[&.active]:font-bold">
					Jokes
				</Link>
				<div className="flex-grow" />
				<ConnectButton chainStatus={"icon"} />
			</div>
			<hr />

			<Outlet />
			<ScrollRestoration />
			<React.Suspense>
				<TanStackRouterDevtools />
				<TanstackQueryDevtools />
			</React.Suspense>
		</>
	);
}
