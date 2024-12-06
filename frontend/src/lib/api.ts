import { hc } from "hono/client";
import type { ApiRoutes } from "../../../server/src";

const client = hc<ApiRoutes>("/");

export const api = client.api;
