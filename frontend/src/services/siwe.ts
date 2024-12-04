import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const getSiweSession = queryOptions({
	queryKey: ["siwe-session"],
	queryFn: async () => {
		const res = await api.auth.me.$get({});
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		return res.json();
	},
	staleTime: 5 * 60_000,
	retry: false,
});
