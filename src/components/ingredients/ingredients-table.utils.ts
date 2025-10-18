import type { Ingredient } from "@/lib/api/ingredients";

/**
 * Column metadata mapping field names to human-friendly display names
 */
export const COLUMN_DISPLAY_NAMES: Record<string, string> = {
	name: "Ingredient Name",
	category: "Category",
	type: "Type",
	status: "Status",
	brand: "Brand",
	"supplier.name": "Supplier",
	supplierCode: "Supplier Code",
	energyPer100g: "Energy (kcal)",
	proteinPer100g: "Protein (g)",
	totalFatPer100g: "Total Fat (g)",
	saturatedFatPer100g: "Saturated Fat (g)",
	totalCarbPer100g: "Total Carbs (g)",
	totalSugarsPer100g: "Total Sugars (g)",
	sodiumMgPer100g: "Sodium (mg)",
	waterPer100g: "Water (g)",
	totalSolidsPer100g: "Total Solids (g)",
	otherSolidsPer100g: "Other Solids (g)",
	msnfPer100g: "MSNF (g)",
	sucrosePer100g: "Sucrose (g)",
	fructosePer100g: "Fructose (g)",
	glucosePer100g: "Glucose (g)",
	dextrosePer100g: "Dextrose (g)",
	alcoholPer100g: "Alcohol (g)",
	otherSugarsPer100g: "Other Sugars (g)",
	dryCocoaSolidsPer100g: "Dry Cocoa Solids (g)",
	cocoaButterPer100g: "Cocoa Butter (g)",
	packageSizeInGrams: "Package Size (g)",
	costPerPackInCentsExGst: "Cost per Pack",
	costPer1000gInCentsExGst: "Cost per 1000g",
	percentOfUsefulProduct: "Useful Product %",
	pac: "PAC",
	pod: "POD",
	hf: "Hardness Factor",
	foodCompositionId: "Food Composition ID",
	createdAt: "Added",
	lastModifiedAt: "Last Modified",
	id: "ID",
};

/**
 * Get human-friendly display name for a column
 */
export function getColumnDisplayName(columnId: string): string {
	return COLUMN_DISPLAY_NAMES[columnId] || columnId;
}

/**
 * Check if an ingredient has nutritional data
 */
export function hasNutritionalData(ingredient: Ingredient): boolean {
	return [
		ingredient.energyPer100g,
		ingredient.proteinPer100g,
		ingredient.totalFatPer100g,
		ingredient.saturatedFatPer100g,
		ingredient.totalCarbPer100g,
		ingredient.totalSugarsPer100g,
		ingredient.sodiumMgPer100g,
		ingredient.waterPer100g,
	].some((val) => val !== null && val !== undefined);
}

/**
 * Check if an ingredient has composition data
 */
export function hasCompositionData(ingredient: Ingredient): boolean {
	return [
		ingredient.totalSolidsPer100g,
		ingredient.msnfPer100g,
		ingredient.dryCocoaSolidsPer100g,
		ingredient.cocoaButterPer100g,
		ingredient.sucrosePer100g,
		ingredient.glucosePer100g,
		ingredient.fructosePer100g,
		ingredient.otherSugarsPer100g,
		ingredient.alcoholPer100g,
		ingredient.otherSolidsPer100g,
	].some((val) => val !== null && val !== undefined);
}

/**
 * Check if an ingredient has additional properties
 */
export function hasAdditionalProperties(ingredient: Ingredient): boolean {
	return [
		ingredient.hf,
		ingredient.pac,
		ingredient.pod,
		ingredient.foodCompositionId,
	].some((val) => val !== null && val !== undefined);
}

/**
 * Format currency value from cents to dollars
 */
export function formatCurrency(valueInCents: number | null): string {
	if (valueInCents === null || valueInCents === undefined) return "—";
	return `$${(valueInCents / 100).toFixed(2)}`;
}

/**
 * Format date to locale string
 */
export function formatDate(dateString: string): string {
	if (!dateString) return "—";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;
	return date.toLocaleDateString();
}

/**
 * Format date with time to locale string
 */
export function formatDateWithTime(dateString: string): string {
	if (!dateString) return "—";
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Format number with optional unit
 */
export function formatNumber(
	value: number | null | undefined,
	unit?: string,
): string {
	if (value === null || value === undefined) return "—";
	return unit ? `${value}${unit}` : `${value}`;
}

/**
 * Default column visibility configuration
 */
export const DEFAULT_COLUMN_VISIBILITY: Record<string, boolean> = {
	name: true,
	category: true,
	type: true,
	status: true,
	brand: true,
	costPer1000gInCentsExGst: true,
	pac: true,
	pod: true,
	"supplier.name": false,
	supplierCode: false,
	energyPer100g: false,
	proteinPer100g: false,
	totalFatPer100g: false,
	saturatedFatPer100g: false,
	totalCarbPer100g: false,
	totalSugarsPer100g: false,
	sodiumMgPer100g: false,
	waterPer100g: false,
	totalSolidsPer100g: false,
	otherSolidsPer100g: false,
	msnfPer100g: false,
	sucrosePer100g: false,
	fructosePer100g: false,
	glucosePer100g: false,
	dextrosePer100g: false,
	alcoholPer100g: false,
	otherSugarsPer100g: false,
	dryCocoaSolidsPer100g: false,
	cocoaButterPer100g: false,
	packageSizeInGrams: false,
	costPerPackInCentsExGst: false,
	percentOfUsefulProduct: false,
	hf: false,
	foodCompositionId: false,
	createdAt: false,
	lastModifiedAt: false,
	id: false,
};
