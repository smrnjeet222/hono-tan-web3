import env from "./config/env";
import { authRouter } from "./routes/auth";

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { type Env, Hono } from "hono";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";

export interface HonoContext extends Env {
	Variables: JwtVariables & {
		user: {
			address: string;
			chainId: number;
		} | null;
	};
}

const app = new Hono<HonoContext>();

app.use("/api/*", logger());
app.use("*", cors());

app.get("/health", (c) => c.text("Hello, World!"));

const routes = app
	.basePath("/api")
	// siwe
	.route("/auth", authRouter);

app.get("*", serveStatic({ root: "../frontend/dist" }));
app.get("*", serveStatic({ path: "../frontend/dist/index.html" }));

serve({
	fetch: app.fetch,
	port: env.PORT,
});

console.log(`Server is running on http://localhost:${env.PORT}`);

export type ApiRoutes = typeof routes;
