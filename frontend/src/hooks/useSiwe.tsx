import { useAccount } from "wagmi";

import { api } from "@/lib/api";
import { getSiweSession } from "@/services/siwe";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSiweMessage } from "viem/siwe";

export function useSiwe() {
	const queryClient = useQueryClient();
	// https://www.rainbowkit.com/docs/custom-authentication
	const authenticationAdapter = createAuthenticationAdapter({
		getNonce: async () => {
			const nonce = await api.auth.nonce.$get();
			return nonce.text();
		},

		createMessage: ({ nonce, address, chainId }) => {
			const message = createSiweMessage({
				domain: window.location.host,
				address,
				statement: "Sign in with Ethereum to the app.",
				uri: window.location.origin,
				version: "1",
				chainId,
				nonce,
			});
			return message;
		},

		verify: async ({ message, signature }) => {
			const res = await api.auth.verify.$post({ json: { message, signature } });
			if (!res.ok) {
				return false;
			}
			const data = await res.json();
			queryClient.setQueryData(getSiweSession.queryKey, data);
			return true;
		},

		signOut: async () => {
			await api.auth.logout.$post();
			queryClient.setQueryData(getSiweSession.queryKey, null);
		},
	});

	const { address } = useAccount();
	const session = useQuery({ ...getSiweSession, enabled: !!address });

	const isAuthenticated =
		!!address && session.data?.address.toLowerCase() === address?.toLowerCase();

	return {
		authenticationAdapter,
		address: session.data?.address,
		isAuthenticated,
		session: session.data,
	};
}
