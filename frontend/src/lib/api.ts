import type { ApiRoutes } from "@/shared/types";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;
