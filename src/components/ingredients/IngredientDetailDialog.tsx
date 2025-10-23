import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Ingredient } from "@/lib/api/ingredients";
import { AdditionalPropertiesSection } from "./AdditionalPropertiesSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { CompositionSection } from "./CompositionSection";
import { AllergenBadge, InfoGrid, InfoItem, Section } from "./dialog-helpers";
import { formatDateWithTime } from "./ingredients-table.utils";
import { NutritionalInfoSection } from "./NutritionalInfoSection";
import { SupplierInfoSection } from "./SupplierInfoSection";
import {
	type IngredientWithSupplier,
	useIngredientForm,
} from "./useIngredientForm";

interface IngredientDetailDialogProps {
	ingredient: IngredientWithSupplier | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	allIngredients?: Ingredient[];
}

export function IngredientDetailDialog({
	ingredient,
	open,
	onOpenChange,
	allIngredients = [],
}: IngredientDetailDialogProps) {
	const {
		state,
		setFieldValue,
		handleSave,
		handleCancel,
		isSaving,
		supplierOptions,
		uniqueCategories,
		uniqueTypes,
		calculatedPac,
		calculatedCostPer1000gInCentsExGst,
	} = useIngredientForm({
		ingredient,
		open,
		onOpenChange,
		allIngredients,
	});

	if (!ingredient) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Ingredient</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 pb-20">
					<div className="space-y-6">
						{/* Basic Information */}
						<BasicInfoSection
							state={state}
							setFieldValue={setFieldValue}
							uniqueCategories={uniqueCategories}
							uniqueTypes={uniqueTypes}
						/>

						{/* Nutritional Information */}
						<NutritionalInfoSection
							ingredient={ingredient}
							state={state}
							setFieldValue={setFieldValue}
						/>

						{/* Composition Details */}
						<CompositionSection
							ingredient={ingredient}
							state={state}
							setFieldValue={setFieldValue}
						/>

						{/* Supplier Information */}
						<SupplierInfoSection
							state={state}
							setFieldValue={setFieldValue}
							supplierOptions={supplierOptions}
							calculatedCostPer1000gInCentsExGst={
								calculatedCostPer1000gInCentsExGst
							}
						/>

						{/* Additional Properties */}
						<AdditionalPropertiesSection
							ingredient={ingredient}
							state={state}
							setFieldValue={setFieldValue}
							calculatedPac={calculatedPac}
						/>

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
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={handleCancel}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSave} disabled={isSaving}>
						{isSaving ? "Saving..." : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
