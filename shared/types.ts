import type { ApiRoutes } from "../server/index";

export type { ApiRoutes };

export type ErrorResponse = {
	error: string;
	isFormError?: boolean;
};
