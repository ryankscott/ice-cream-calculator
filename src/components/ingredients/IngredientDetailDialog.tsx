import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Ingredient } from "@/lib/api/ingredients";
import { AllergenBadge, InfoGrid, InfoItem, Section } from "./dialog-helpers";
import {
	formatCurrency,
	formatDateWithTime,
	hasAdditionalProperties,
	hasCompositionData,
	hasNutritionalData,
} from "./ingredients-table.utils";

interface IngredientWithSupplier extends Ingredient {
	supplier?: {
		id: string;
		name: string;
	};
}

interface IngredientDetailDialogProps {
	ingredient: IngredientWithSupplier | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function IngredientDetailDialog({
	ingredient,
	open,
	onOpenChange,
}: IngredientDetailDialogProps) {
	if (!ingredient) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{ingredient.name}</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<Section title="Basic Information">
						<InfoGrid>
							<InfoItem label="Category" value={ingredient.category} />
							<InfoItem label="Type" value={ingredient.type} />
							<InfoItem
								label="Status"
								value={ingredient.status}
								badge={ingredient.status}
							/>
							{ingredient.brand && (
								<InfoItem label="Brand" value={ingredient.brand} />
							)}
							{ingredient.supplierCode && (
								<InfoItem
									label="Supplier Code"
									value={ingredient.supplierCode}
								/>
							)}
						</InfoGrid>
					</Section>

					{/* Nutritional Information */}
					{hasNutritionalData(ingredient) && (
						<Section title="Nutritional Information (per 100g)">
							<InfoGrid>
								{ingredient.energyPer100g !== null &&
									ingredient.energyPer100g !== undefined && (
										<InfoItem
											label="Energy"
											value={`${ingredient.energyPer100g} kcal`}
										/>
									)}
								{ingredient.proteinPer100g !== null &&
									ingredient.proteinPer100g !== undefined && (
										<InfoItem
											label="Protein"
											value={`${ingredient.proteinPer100g}g`}
										/>
									)}
								{ingredient.totalFatPer100g !== null &&
									ingredient.totalFatPer100g !== undefined && (
										<InfoItem
											label="Total Fat"
											value={`${ingredient.totalFatPer100g}g`}
										/>
									)}
								{ingredient.saturatedFatPer100g !== null &&
									ingredient.saturatedFatPer100g !== undefined && (
										<InfoItem
											label="Saturated Fat"
											value={`${ingredient.saturatedFatPer100g}g`}
										/>
									)}
								{ingredient.totalCarbPer100g !== null &&
									ingredient.totalCarbPer100g !== undefined && (
										<InfoItem
											label="Total Carbohydrates"
											value={`${ingredient.totalCarbPer100g}g`}
										/>
									)}
								{ingredient.totalSugarsPer100g !== null &&
									ingredient.totalSugarsPer100g !== undefined && (
										<InfoItem
											label="Total Sugars"
											value={`${ingredient.totalSugarsPer100g}g`}
										/>
									)}
								{ingredient.sodiumMgPer100g !== null &&
									ingredient.sodiumMgPer100g !== undefined && (
										<InfoItem
											label="Sodium"
											value={`${ingredient.sodiumMgPer100g}mg`}
										/>
									)}
							</InfoGrid>
						</Section>
					)}

					{/* Composition Details */}
					{hasCompositionData(ingredient) && (
						<Section title="Composition Details">
							<InfoGrid>
								{ingredient.waterPer100g !== null &&
									ingredient.waterPer100g !== undefined && (
										<InfoItem
											label="Water"
											value={`${ingredient.waterPer100g}g`}
										/>
									)}
								{ingredient.totalSolidsPer100g !== null &&
									ingredient.totalSolidsPer100g !== undefined && (
										<InfoItem
											label="Total Solids"
											value={`${ingredient.totalSolidsPer100g}g`}
										/>
									)}
								{ingredient.msnfPer100g !== null &&
									ingredient.msnfPer100g !== undefined && (
										<InfoItem
											label="MSNF"
											value={`${ingredient.msnfPer100g}g`}
										/>
									)}
								{ingredient.dryCocoaSolidsPer100g !== null &&
									ingredient.dryCocoaSolidsPer100g !== undefined && (
										<InfoItem
											label="Dry Cocoa Solids"
											value={`${ingredient.dryCocoaSolidsPer100g}g`}
										/>
									)}
								{ingredient.cocoaButterPer100g !== null &&
									ingredient.cocoaButterPer100g !== undefined && (
										<InfoItem
											label="Cocoa Butter"
											value={`${ingredient.cocoaButterPer100g}g`}
										/>
									)}
								{ingredient.sucrosePer100g !== null &&
									ingredient.sucrosePer100g !== undefined && (
										<InfoItem
											label="Sucrose"
											value={`${ingredient.sucrosePer100g}g`}
										/>
									)}
								{ingredient.glucosePer100g !== null &&
									ingredient.glucosePer100g !== undefined && (
										<InfoItem
											label="Glucose"
											value={`${ingredient.glucosePer100g}g`}
										/>
									)}
								{ingredient.fructosePer100g !== null &&
									ingredient.fructosePer100g !== undefined && (
										<InfoItem
											label="Fructose"
											value={`${ingredient.fructosePer100g}g`}
										/>
									)}
								{ingredient.otherSugarsPer100g !== null &&
									ingredient.otherSugarsPer100g !== undefined && (
										<InfoItem
											label="Other Sugars"
											value={`${ingredient.otherSugarsPer100g}g`}
										/>
									)}
								{ingredient.alcoholPer100g !== null &&
									ingredient.alcoholPer100g !== undefined && (
										<InfoItem
											label="Alcohol"
											value={`${ingredient.alcoholPer100g}g`}
										/>
									)}
								{ingredient.otherSolidsPer100g !== null &&
									ingredient.otherSolidsPer100g !== undefined && (
										<InfoItem
											label="Other Solids"
											value={`${ingredient.otherSolidsPer100g}g`}
										/>
									)}
							</InfoGrid>
						</Section>
					)}

					{/* Supplier Information */}
					<Section title="Supplier">
						<InfoGrid>
							{ingredient.supplier && (
								<InfoItem
									label="Supplier Name"
									value={ingredient.supplier.name}
								/>
							)}
							{ingredient.costPerPackInCentsExGst !== null &&
								ingredient.costPerPackInCentsExGst !== undefined && (
									<InfoItem
										label="Cost per Pack"
										value={formatCurrency(ingredient.costPerPackInCentsExGst)}
									/>
								)}
							{ingredient.costPer1000gInCentsExGst !== null &&
								ingredient.costPer1000gInCentsExGst !== undefined && (
									<InfoItem
										label="Cost per 1000g"
										value={formatCurrency(ingredient.costPer1000gInCentsExGst)}
									/>
								)}
							{ingredient.packageSizeInGrams !== null &&
								ingredient.packageSizeInGrams !== undefined && (
									<InfoItem
										label="Package Size"
										value={`${ingredient.packageSizeInGrams}g`}
									/>
								)}
							{ingredient.percentOfUsefulProduct !== null &&
								ingredient.percentOfUsefulProduct !== undefined && (
									<InfoItem
										label="Useful Product %"
										value={`${ingredient.percentOfUsefulProduct}%`}
									/>
								)}
						</InfoGrid>
					</Section>

					{/* Additional Properties */}
					{hasAdditionalProperties(ingredient) && (
						<Section title="Additional Properties">
							<InfoGrid>
								{ingredient.hf !== null && ingredient.hf !== undefined && (
									<InfoItem
										label="Hardness Factor"
										value={String(ingredient.hf)}
									/>
								)}
								{ingredient.pac !== null && ingredient.pac !== undefined && (
									<InfoItem label="PAC" value={String(ingredient.pac)} />
								)}
								{ingredient.pod !== null && ingredient.pod !== undefined && (
									<InfoItem label="POD" value={String(ingredient.pod)} />
								)}
								{ingredient.foodCompositionId && (
									<InfoItem
										label="Food Composition ID"
										value={ingredient.foodCompositionId}
									/>
								)}
							</InfoGrid>
						</Section>
					)}

					{/* Allergens */}
					{ingredient.allergens &&
						Object.keys(ingredient.allergens).length > 0 && (
							<Section title="Allergens">
								<div className="space-y-2">
									{Object.entries(ingredient.allergens).map(
										([allergen, value]) => (
											<div
												key={allergen}
												className="flex items-center justify-between text-sm"
											>
												<span className="capitalize">{allergen}</span>
												<AllergenBadge present={Boolean(value)} />
											</div>
										),
									)}
								</div>
							</Section>
						)}

					{/* Metadata */}
					<Section title="Metadata">
						<InfoGrid>
							<InfoItem
								label="Created"
								value={formatDateWithTime(ingredient.createdAt)}
							/>
							<InfoItem
								label="Last Modified"
								value={formatDateWithTime(ingredient.lastModifiedAt)}
							/>
							<InfoItem label="ID" value={ingredient.id} />
						</InfoGrid>
					</Section>
				</div>
			</DialogContent>
		</Dialog>
	);
}
