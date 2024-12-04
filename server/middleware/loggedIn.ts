import { createMiddleware } from "hono/factory";

import { jwt } from "hono/jwt";
import type { HonoContext } from "..";
import env from "../config/env";

export const loggedIn = createMiddleware<HonoContext>(async (c, next) => {
	const jwtMiddleware = jwt({
		cookie: "auth_token",
		secret: env.JWT_SECRET,
	});

	return jwtMiddleware(c, () => {
		const payload = c.get("jwtPayload");
		const sub = payload?.sub as string;

		if (sub) {
			const [, chainId, address] = sub.split(":");
			if (address && chainId) {
				c.set("user", { address, chainId: Number(chainId) });
			}
		}

		return next();
	});
});
