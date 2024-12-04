import {
	RainbowKitAuthenticationProvider,
	RainbowKitProvider,
	darkTheme,
} from "@rainbow-me/rainbowkit";

import { useSiwe } from "@/hooks/useSiwe";

// https://www.rainbowkit.com/docs/theming
export function CustomRainbowKitProvider({
	children,
}: { children: React.ReactNode }) {
	const { isAuthenticated, authenticationAdapter } = useSiwe();

	return (
		<RainbowKitAuthenticationProvider
			adapter={authenticationAdapter}
			status={isAuthenticated ? "authenticated" : "unauthenticated"}
		>
			<RainbowKitProvider
				coolMode
				showRecentTransactions={true}
				theme={darkTheme()}
			>
				{children}
			</RainbowKitProvider>
		</RainbowKitAuthenticationProvider>
	);
}
