import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "../../components/ui/dialog";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { Ingredient } from "@ice-cream-calculator/shared";

interface IngredientDialogProps {
	ingredient: Ingredient | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function centsToCurrency(cents: number) {
	if (Number.isNaN(cents)) return "-";
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: "NZD",
		maximumFractionDigits: 2,
	}).format(cents / 100);
}

export function IngredientDialog({ ingredient, open, onOpenChange }: IngredientDialogProps) {
	const currency = (cents: number) => centsToCurrency(cents);

	function toTitleCase(str: string): React.ReactNode {
		return str
			.split(/(?=[A-Z])/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-scroll">
				{ingredient && (
					<>
						<DialogHeader>
							<DialogTitle className="text-xl">{ingredient.name}</DialogTitle>
							<DialogDescription>
								Brand: {ingredient.brand || "-"} • Supplier: {ingredient.supplier?.name || "-"}
							</DialogDescription>
						</DialogHeader>
						<Accordion type="multiple" className="w-full">
							<AccordionItem value="classification">
								<AccordionTrigger className="font-medium text-base">Classification</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-col gap-2 text-sm flex-wrap">
										<div className="flex gap-2">
											<span className="text-muted-foreground">Status:</span>
											<Badge>{ingredient.status}</Badge>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Category:</span>
											<p className="font-medium">{ingredient.category}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Type:</span>
											<p className="font-medium">{ingredient.type}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Food Comp ID:</span>
											<p className="font-medium">{ingredient.foodCompositionID}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Created:</span>
											<p className="font-medium">{new Date(ingredient.createdAt).toLocaleDateString()}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Updated:</span>
											<p className="font-medium">{new Date(ingredient.lastModifiedAt).toLocaleDateString()}</p>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="nutrition">
								<AccordionTrigger className="font-medium text-base">Nutrition (per 100g)</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-col gap-2 text-sm flex-wrap">
										<div className="flex gap-2">
											<span className="text-muted-foreground">Energy:</span>
											<p className="font-medium">{ingredient.energyPer100g} kJ</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Protein:</span>
											<p className="font-medium">{ingredient.proteinPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Fat:</span>
											<p className="font-medium">{ingredient.totalFatPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Saturated:</span>
											<p className="font-medium">{ingredient.saturatedFatPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Carbs:</span>
											<p className="font-medium">{ingredient.totalCarbPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Sugars:</span>
											<p className="font-medium">{ingredient.totalSugarsPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Sodium:</span>
											<p className="font-medium">{ingredient.sodiumMgPer100g} mg</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Water:</span>
											<p className="font-medium">{ingredient.waterPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Total Solids:</span>
											<p className="font-medium">{ingredient.totalSolidsPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Other Solids:</span>
											<p className="font-medium">{ingredient.otherSolidsPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">MSNF:</span>
											<p className="font-medium">{ingredient.MSNFPer100g} g</p>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="sugars">
								<AccordionTrigger className="font-medium text-base">Sugars Breakdown (per 100g)</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-col gap-2 text-sm flex-wrap">
										<div className="flex gap-2">
											<span className="text-muted-foreground">Sucrose:</span>
											<p className="font-medium">{ingredient.sugarsPer100g.sucrose}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Fructose:</span>
											<p className="font-medium">{ingredient.sugarsPer100g.fructose}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Glucose:</span>
											<p className="font-medium">{ingredient.sugarsPer100g.glucose}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Dextrose:</span>
											<p className="font-medium">{ingredient.sugarsPer100g.dextrose}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Alcohol:</span>
											<p className="font-medium">{ingredient.sugarsPer100g.alcohol}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Other:</span>
											<p className="font-medium">{ingredient.sugarsPer100g.other}</p>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="functional">
								<AccordionTrigger className="font-medium text-base">Functional</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-col gap-2 text-sm flex-wrap">
										<div className="flex gap-2">
											<span className="text-muted-foreground">PAC:</span>
											<p className="font-medium">{ingredient.PAC}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">POD:</span>
											<p className="font-medium">{ingredient.POD}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">HF:</span>
											<p className="font-medium">{ingredient.HF}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Dry Cocoa Solids:</span>
											<p className="font-medium">{ingredient.dryCocoaSolidsPer100g} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Cocoa Butter:</span>
											<p className="font-medium">{ingredient.cocoaButterPer100g} g</p>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="commercial">
								<AccordionTrigger className="font-medium text-base">Commercial</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-col gap-2 text-sm flex-wrap">
										<div className="flex gap-2">
											<span className="text-muted-foreground">Supplier Code:</span>
											<p className="font-medium">{String(ingredient.supplierCode)}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Pack Size:</span>
											<p className="font-medium">{ingredient.packageSizeInGrams} g</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Cost / Pack:</span>
											<p className="font-medium">{currency(ingredient.costPerPackInCentsExGST)}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Cost / kg:</span>
											<p className="font-medium">{currency(ingredient.costPer1000gInCentsExGST)}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Useful %:</span>
											<p className="font-medium">{ingredient.percentOfUsefulProduct}%</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Supplier Email:</span>
											<p className="font-medium">{ingredient.supplier?.contactInfo.email || '-'}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Supplier Phone:</span>
											<p className="font-medium">{ingredient.supplier?.contactInfo.phone || '-'}</p>
										</div>
										<div className="flex gap-2">
											<span className="text-muted-foreground">Website:</span>
											<p className="font-medium">
												{ingredient.supplier?.website ? (
													<a 
														className="text-primary hover:underline" 
														href={ingredient.supplier.website} 
														target="_blank" 
														rel="noreferrer"
													>
														Link
													</a>
												) : '-'}
											</p>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="allergens">
								<AccordionTrigger className="font-medium text-base">Allergens</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-wrap gap-2">
										{Object.entries(ingredient.allergens)
											.filter(([, v]) => v) // Only show allergens that are present
											.map(([k]) => (
												<Badge
													key={k}
													className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
													title="Present"
												>
													{toTitleCase(k)}
												</Badge>
											))}
										{Object.entries(ingredient.allergens).every(([, v]) => !v) && (
											<p className="text-muted-foreground text-sm">No allergens present</p>
										)}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<DialogFooter>
							<button
								onClick={() => onOpenChange(false)}
								className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
								type="button"
							>
								Close
							</button>
						</DialogFooter>
						</>
				)}
					</DialogContent>
		</Dialog>
	);
}
