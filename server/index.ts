import type { ErrorResponse } from "@/shared/types";
import env from "./config/env";
import { authRouter } from "./routes/auth";

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { type Env, Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
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

const routes = app
	.basePath("/api")
	// siwe
	.route("/auth", authRouter);

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		const errResponse =
			err.res ??
			c.json<ErrorResponse>(
				{
					error: err.message,
					isFormError:
						err.cause && typeof err.cause === "object" && "form" in err.cause
							? err.cause.form === true
							: false,
				},
				err.status,
			);
		return errResponse;
	}

	return c.json<ErrorResponse>(
		{
			error:
				env.NODE_ENV === "production"
					? "Interal Server Error"
					: (err.stack ?? err.message),
		},
		500,
	);
});

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

serve({
	fetch: app.fetch,
	port: env.PORT,
});

console.log(`Server is running on http://localhost:${env.PORT}`);

export type ApiRoutes = typeof routes;
