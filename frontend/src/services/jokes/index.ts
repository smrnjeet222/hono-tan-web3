import { FetchWrapper } from "@/lib/fetch";
import { queryOptions } from "@tanstack/react-query";

class JokeService {
	fetch = new FetchWrapper("https://api.chucknorris.io/");

	service = "jokes";

	createPath(paths: string[]) {
		return [this.service, ...paths].join("/");
	}

	public getRandomJoke(params?: {
		category: string;
	}) {
		const path = this.createPath(["random"]);

		return queryOptions({
			queryKey: [path],
			queryFn: () =>
				this.fetch.get(path, {
					params,
				}),
		});
	}
}

export default new JokeService();
