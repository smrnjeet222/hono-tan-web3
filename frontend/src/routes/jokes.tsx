import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/jokes")({
	component: LayoutComponent,
});

function LayoutComponent() {
	return (
		<div className="m-3">
			<p className="text-4xl pb-2">Jokes</p>
			<hr />
			<br />
			<Outlet />
		</div>
	);
}
