import { loggedIn } from "@/middleware/loggedIn";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { SiweMessage, generateNonce } from "siwe";
import { getAddress } from "viem";
import { z } from "zod";
import type { HonoContext } from "..";
import env from "../config/env";

export const authRouter = new Hono<HonoContext>()
	.get("/nonce", (c) => {
		const nonce = generateNonce();
		setCookie(c, "nonce", nonce, {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
			maxAge: 60 * 5 * 1000,
		});
		return c.text(nonce);
	})
	.get("/me", loggedIn, async (c) => {
		return c.json(c.get("user") ?? null, 200);
	})
	.post(
		"/verify",
		zValidator(
			"json",
			z.object({
				message: z.string(),
				signature: z.string(),
			}),
		),
		async (c) => {
			const body = c.req.valid("json");
			const siweMessage = new SiweMessage(body.message);

			const nonce = getCookie(c, "nonce");

			if (!nonce) {
				throw new HTTPException(400, { message: "Missing nonce" });
			}

			const result = await siweMessage.verify({
				signature: body.signature,
				nonce,
			});

			if (!result.success) {
				throw new HTTPException(401, { message: "Invalid signature" });
			}

			const address = getAddress(result.data.address);
			const chainId = result.data.chainId;

			const payload = {
				sub: `eip155:${chainId}:${address}`,
				role: "user",
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // expire in 24 hours
				iss: "hono-tan",
			};

			const token = await sign(payload, env.JWT_SECRET);

			setCookie(c, "auth_token", token, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
			});

			return c.json({ address: address, chainId: chainId }, 200);
		},
	)
	.post("/logout", async (c) => {
		deleteCookie(c, "auth_token");
		deleteCookie(c, "nonce");
		return c.json({ ok: true }, 200);
	});
