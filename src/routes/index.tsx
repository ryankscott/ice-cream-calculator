import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { IngredientsTable } from "@/components/ingredients/IngredientsTable";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
	component: App,
});

type TabValue = "ingredients" | "suppliers";

function App() {
	const [activeTab, setActiveTab] = useState<TabValue>("ingredients");

	return (
		<main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8 lg:px-12">
			<div className="mx-auto flex max-w-6xl flex-col gap-8">
				<header className="space-y-3">
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Gelato Management
					</h1>
				</header>

				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as TabValue)}
				>
					<TabsList>
						<TabsTrigger value="ingredients">Ingredients</TabsTrigger>
						<TabsTrigger value="suppliers">Suppliers</TabsTrigger>
					</TabsList>

					<TabsContent value="ingredients" className="mt-6">
						<IngredientsTable />
					</TabsContent>

					<TabsContent value="suppliers" className="mt-6">
						<SuppliersTable />
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
