import type { IngredientFormState } from "./useIngredientForm";

type NumberFieldKey = {
	[K in keyof IngredientFormState]: IngredientFormState[K] extends number | null
		? K
		: never;
}[keyof IngredientFormState];

export interface NumberFieldConfig {
	key: NumberFieldKey;
	label: string;
	placeholder?: string;
}

export const NUTRITIONAL_FIELDS: NumberFieldConfig[] = [
	{ key: "energyPer100g", label: "Energy (kcal)" },
	{ key: "proteinPer100g", label: "Protein (g)" },
	{ key: "totalFatPer100g", label: "Total Fat (g)" },
	{ key: "saturatedFatPer100g", label: "Saturated Fat (g)" },
	{ key: "totalCarbPer100g", label: "Total Carbs (g)" },
	{ key: "totalSugarsPer100g", label: "Total Sugars (g)" },
	{ key: "sodiumMgPer100g", label: "Sodium (mg)" },
	{ key: "waterPer100g", label: "Water (g)" },
];

export const COMPOSITION_FIELDS: NumberFieldConfig[] = [
	{ key: "totalSolidsPer100g", label: "Total Solids (g)" },
	{ key: "msnfPer100g", label: "MSNF (g)" },
	{ key: "dryCocoaSolidsPer100g", label: "Dry Cocoa Solids (g)" },
	{ key: "cocoaButterPer100g", label: "Cocoa Butter (g)" },
	{ key: "sucrosePer100g", label: "Sucrose (g)" },
	{ key: "glucosePer100g", label: "Glucose (g)" },
	{ key: "fructosePer100g", label: "Fructose (g)" },
	{ key: "otherSugarsPer100g", label: "Other Sugars (g)" },
	{ key: "alcoholPer100g", label: "Alcohol (g)" },
	{ key: "dextrosePer100g", label: "Dextrose (g)" },
	{ key: "otherSolidsPer100g", label: "Other Solids (g)" },
];

export const SUPPLIER_NUMBER_FIELDS: NumberFieldConfig[] = [
	{ key: "packageSizeInGrams", label: "Package Size (g)" },
	{ key: "costPerPackInCentsExGst", label: "Cost per Pack (¢)" },
	{ key: "percentOfUsefulProduct", label: "Useful Product (%)" },
];

export const ADDITIONAL_NUMBER_FIELDS: NumberFieldConfig[] = [
	{ key: "hf", label: "Hardness Factor" },
	{ key: "pod", label: "POD" },
];
