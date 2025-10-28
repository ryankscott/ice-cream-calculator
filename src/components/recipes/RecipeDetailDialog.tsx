import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Recipe } from "@/lib/api/recipes";

interface RecipeDetailDialogProps {
	recipe: Recipe | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function RecipeDetailDialog({
	recipe,
	open,
	onOpenChange,
}: RecipeDetailDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
				{recipe ? (
					<div className="space-y-6">
						<DialogHeader>
							<DialogTitle className="text-2xl font-semibold">
								{recipe.name}
							</DialogTitle>
							<p className="text-sm text-muted-foreground">
								Type: {recipe.type.replace(/([A-Z])/g, " $1").trim()}
							</p>
						</DialogHeader>

						<section className="space-y-2">
							<h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
								Ingredients
							</h3>
							<div className="rounded-md border">
								<ul className="divide-y">
									{recipe.ingredients.map((item) => (
										<li
											key={`${item.ingredientId}-${item.quantityInGrams}`}
											className="flex items-center justify-between gap-4 px-4 py-2 text-sm"
										>
											<span className="font-mono text-xs text-muted-foreground">
												{item.ingredientId.slice(0, 8)}
											</span>
											<span>{item.quantityInGrams} g</span>
										</li>
									))}
								</ul>
							</div>
						</section>

						<section className="space-y-2">
							<h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
								Input Parameters
							</h3>
							<div className="grid gap-2 sm:grid-cols-2">
								{Object.entries(recipe.inputParameters).map(([key, value]) => (
									<div
										key={key}
										className="rounded-md border px-3 py-2 text-sm"
									>
										<p className="text-xs uppercase tracking-wide text-muted-foreground">
											{formatLabel(key)}
										</p>
										<p className="font-medium">{value}</p>
									</div>
								))}
							</div>
						</section>

						<section className="space-y-2">
							<h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
								Calculated Outputs
							</h3>
							{recipe.calculatedOutputs ? (
								<div className="grid gap-2 sm:grid-cols-2">
									{Object.entries(recipe.calculatedOutputs).map(
										([key, value]) => (
											<div
												key={key}
												className="rounded-md border px-3 py-2 text-sm"
											>
												<p className="text-xs uppercase tracking-wide text-muted-foreground">
													{formatLabel(key)}
												</p>
												<p className="font-medium">{value}</p>
											</div>
										),
									)}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Outputs will appear once calculations run.
								</p>
							)}
						</section>
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

function formatLabel(key: string): string {
	return key
		.replace(/([A-Z])/g, " $1")
		.replace(/_/g, " ")
		.trim()
		.replace(/\b(g)\b/gi, "g");
}
