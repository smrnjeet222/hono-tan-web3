import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { arbitrum, base, mainnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
	appName: "Web3 Tanstack",
	projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
	chains: [mainnet, arbitrum, base],
	transports: {
		[mainnet.id]: http(
			`https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
		),
		[arbitrum.id]: http(
			`https://arb-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
		),
		[base.id]: http(
			`https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
		),
	},
});
