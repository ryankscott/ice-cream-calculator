import { createFileRoute } from "@tanstack/react-router";

import { IngredientsTable } from "@/components/ingredients/IngredientsTable";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8 lg:px-12">
			<div className="mx-auto flex max-w-6xl flex-col gap-8">
				<header className="space-y-3">
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Gelato Ingredients
					</h1>
				</header>

				<IngredientsTable />
			</div>
		</main>
	);
}
