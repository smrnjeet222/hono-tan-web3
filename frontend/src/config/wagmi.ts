import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
	appName: "Web3 Tanstack",
	projectId: "YOUR_PROJECT_ID",
	chains: [mainnet, polygon, optimism, arbitrum, base],
});
