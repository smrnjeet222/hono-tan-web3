import jokes from "@/services/jokes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jokes/")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(jokes.getRandomJoke());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const joke = useSuspenseQuery(jokes.getRandomJoke());

	return (
		<div>
			<pre>{JSON.stringify(joke.data, null, 2)}</pre>
		</div>
	);
}
