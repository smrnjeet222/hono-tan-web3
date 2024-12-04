export type FetchOptions = RequestInit & {
	timeout?: number;
	params?: Record<string, string>;
};

export class FetchWrapper {
	private baseURL: string;
	private defaultHeaders: HeadersInit;
	private timeout: number;

	constructor(baseURL: string, defaultHeaders?: HeadersInit, timeout?: number) {
		this.baseURL = baseURL;
		this.defaultHeaders = defaultHeaders ?? {
			"Content-Type": "application/json",
		};
		this.timeout = timeout ?? 30_000;
	}

	private async fetch(url: string, options: FetchOptions) {
		const fullUrl = new URL(url, this.baseURL);

		if (options?.params) {
			const params = new URLSearchParams(options.params);
			fullUrl.search = params.toString();
		}

		if (options?.body) {
			options.body = JSON.stringify(options.body);
		}

		const response = await fetch(fullUrl, {
			signal: AbortSignal.timeout(options.timeout ?? this.timeout),
			...options,
			headers: {
				...this.defaultHeaders,
				...options.headers,
			},
		});

		// testing
		// sleep for 3 second
		await new Promise((resolve) => setTimeout(resolve, 3000));

		if (response.ok) {
			return await response.json();
		}

		const errorMessage = await response.text();
		return Promise.reject(new Error(errorMessage));
	}

	public get<T>(
		url: string,
		options?: Omit<FetchOptions, "method">,
	): Promise<T> {
		return this.fetch(url, {
			...options,
			method: "GET",
		});
	}

	public post<T>(
		url: string,
		body: Record<string, unknown>,
		options?: Omit<FetchOptions, "method">,
	): Promise<T> {
		return this.fetch(url, {
			...options,
			method: "POST",
		});
	}

	public put<T>(
		url: string,
		body: Record<string, unknown>,
		options?: Omit<FetchOptions, "method">,
	): Promise<T> {
		return this.fetch(url, {
			...options,
			method: "PUT",
		});
	}

	public delete<T>(
		url: string,
		options?: Omit<FetchOptions, "method">,
	): Promise<T> {
		return this.fetch(url, {
			...options,
			method: "DELETE",
		});
	}
}
