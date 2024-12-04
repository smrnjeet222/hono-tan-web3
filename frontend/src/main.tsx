import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider, useAccount } from "wagmi";
import type { GetAccountReturnType } from "wagmi/actions";

import { CustomRainbowKitProvider } from "@/providers/RainbowKit";
import { routeTree } from "./routeTree.gen";

import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./config/wagmi";
import { useSiwe } from "./hooks/useSiwe";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1_000,
		},
	},
});

export type TRootContext = {
	queryClient: QueryClient;
	wallet: GetAccountReturnType | null;
	isAuthenticated: boolean;
	session: string | null;
};

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultPendingComponent: () => <div>Loading...</div>,
	defaultNotFoundComponent: () => <div>404 Not Found</div>,
	context: { queryClient, wallet: null, isAuthenticated: false, session: null },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function Root() {
	const wallet = useAccount();
	const { isAuthenticated, address } = useSiwe();
	return (
		<RouterProvider
			router={router}
			context={{
				queryClient,
				wallet,
				isAuthenticated,
				session: address ?? null,
			}}
		/>
	);
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={wagmiConfig}>
					<CustomRainbowKitProvider>
						<Root />
					</CustomRainbowKitProvider>
				</WagmiProvider>
			</QueryClientProvider>
		</StrictMode>,
	);
}
