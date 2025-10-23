import { useCallback, useEffect, useMemo, useReducer } from "react";

import type { Ingredient } from "@/lib/api/ingredients";
import { useSuppliers } from "@/lib/hooks/useSuppliers";
import { useUpdateIngredient } from "@/lib/hooks/useUpdateIngredient";

export interface IngredientWithSupplier extends Ingredient {
	supplier?: {
		id: string;
		name: string;
	};
}

export interface IngredientFormState {
	name: string;
	category: string;
	type: string;
	status: "Active" | "Inactive";
	brand: string;
	supplierId: string;
	energyPer100g: number | null;
	proteinPer100g: number | null;
	totalFatPer100g: number | null;
	saturatedFatPer100g: number | null;
	totalCarbPer100g: number | null;
	totalSugarsPer100g: number | null;
	sodiumMgPer100g: number | null;
	waterPer100g: number | null;
	totalSolidsPer100g: number | null;
	otherSolidsPer100g: number | null;
	msnfPer100g: number | null;
	dryCocoaSolidsPer100g: number | null;
	cocoaButterPer100g: number | null;
	sucrosePer100g: number | null;
	fructosePer100g: number | null;
	glucosePer100g: number | null;
	dextrosePer100g: number | null;
	alcoholPer100g: number | null;
	otherSugarsPer100g: number | null;
	hf: number | null;
	pod: number | null;
	packageSizeInGrams: number | null;
	costPerPackInCentsExGst: number | null;
	costPer1000gInCentsExGst: number | null;
	percentOfUsefulProduct: number | null;
	supplierCode: string;
	foodCompositionId: string;
}

type IngredientFormAction =
	| { type: "reset" }
	| { type: "initialize"; ingredient: IngredientWithSupplier }
	| {
			field: keyof IngredientFormState;
			type: "update";
			value: IngredientFormState[keyof IngredientFormState];
	  };

const EMPTY_FORM_STATE: IngredientFormState = {
	name: "",
	category: "",
	type: "",
	status: "Active",
	brand: "",
	supplierId: "",
	energyPer100g: null,
	proteinPer100g: null,
	totalFatPer100g: null,
	saturatedFatPer100g: null,
	totalCarbPer100g: null,
	totalSugarsPer100g: null,
	sodiumMgPer100g: null,
	waterPer100g: null,
	totalSolidsPer100g: null,
	otherSolidsPer100g: null,
	msnfPer100g: null,
	dryCocoaSolidsPer100g: null,
	cocoaButterPer100g: null,
	sucrosePer100g: null,
	fructosePer100g: null,
	glucosePer100g: null,
	dextrosePer100g: null,
	alcoholPer100g: null,
	otherSugarsPer100g: null,
	hf: null,
	pod: null,
	packageSizeInGrams: null,
	costPerPackInCentsExGst: null,
	costPer1000gInCentsExGst: null,
	percentOfUsefulProduct: null,
	supplierCode: "",
	foodCompositionId: "",
};

const PAC_CONSTANTS = {
	lactose: 1,
	sucrose: 1,
	fructose: 1.9,
	dextrose: 1.7,
	glucose: 1.9,
	ethanol: 7.4,
	salt: 100,
} as const;

function toNullableNumber(value: number | null | undefined): number | null {
	return value === null || value === undefined ? null : value;
}

function formReducer(
	state: IngredientFormState,
	action: IngredientFormAction,
): IngredientFormState {
	if (action.type === "reset") {
		return { ...EMPTY_FORM_STATE };
	}

	if (action.type === "initialize") {
		const ingredient = action.ingredient;
		return {
			name: ingredient.name,
			category: ingredient.category,
			type: ingredient.type,
			status: ingredient.status,
			brand: ingredient.brand ?? "",
			supplierId: ingredient.supplierId,
			energyPer100g: toNullableNumber(ingredient.energyPer100g),
			proteinPer100g: toNullableNumber(ingredient.proteinPer100g),
			totalFatPer100g: toNullableNumber(ingredient.totalFatPer100g),
			saturatedFatPer100g: toNullableNumber(ingredient.saturatedFatPer100g),
			totalCarbPer100g: toNullableNumber(ingredient.totalCarbPer100g),
			totalSugarsPer100g: toNullableNumber(ingredient.totalSugarsPer100g),
			sodiumMgPer100g: toNullableNumber(ingredient.sodiumMgPer100g),
			waterPer100g: toNullableNumber(ingredient.waterPer100g),
			totalSolidsPer100g: toNullableNumber(ingredient.totalSolidsPer100g),
			otherSolidsPer100g: toNullableNumber(ingredient.otherSolidsPer100g),
			msnfPer100g: toNullableNumber(ingredient.msnfPer100g),
			dryCocoaSolidsPer100g: toNullableNumber(ingredient.dryCocoaSolidsPer100g),
			cocoaButterPer100g: toNullableNumber(ingredient.cocoaButterPer100g),
			sucrosePer100g: toNullableNumber(ingredient.sucrosePer100g),
			fructosePer100g: toNullableNumber(ingredient.fructosePer100g),
			glucosePer100g: toNullableNumber(ingredient.glucosePer100g),
			dextrosePer100g: toNullableNumber(ingredient.dextrosePer100g),
			alcoholPer100g: toNullableNumber(ingredient.alcoholPer100g),
			otherSugarsPer100g: toNullableNumber(ingredient.otherSugarsPer100g),
			hf: toNullableNumber(ingredient.hf),
			pod: toNullableNumber(ingredient.pod),
			packageSizeInGrams: toNullableNumber(ingredient.packageSizeInGrams),
			costPerPackInCentsExGst: toNullableNumber(
				ingredient.costPerPackInCentsExGst,
			),
			costPer1000gInCentsExGst: toNullableNumber(
				ingredient.costPer1000gInCentsExGst,
			),
			percentOfUsefulProduct: toNullableNumber(
				ingredient.percentOfUsefulProduct,
			),
			supplierCode: ingredient.supplierCode ?? "",
			foodCompositionId: ingredient.foodCompositionId ?? "",
		};
	}

	if (action.type === "update") {
		return {
			...state,
			[action.field]: action.value,
		};
	}

	return state;
}

export function calculatePAC(state: IngredientFormState): number {
	let pac = 0;

	if (state.sucrosePer100g !== null) {
		pac += state.sucrosePer100g * PAC_CONSTANTS.sucrose;
	}
	if (state.fructosePer100g !== null) {
		pac += state.fructosePer100g * PAC_CONSTANTS.fructose;
	}
	if (state.dextrosePer100g !== null) {
		pac += state.dextrosePer100g * PAC_CONSTANTS.dextrose;
	}
	if (state.glucosePer100g !== null) {
		pac += state.glucosePer100g * PAC_CONSTANTS.glucose;
	}
	if (state.alcoholPer100g !== null) {
		pac += state.alcoholPer100g * PAC_CONSTANTS.ethanol;
	}
	if (state.sodiumMgPer100g !== null) {
		const saltPer100g = state.sodiumMgPer100g / 1000 / 0.39;
		pac += saltPer100g * PAC_CONSTANTS.salt;
	}

	return Math.round(pac * 100) / 100;
}

export function calculateCostPer1000gInCentsExGst({
	costPerPackInCentsExGst,
	packageSizeInGrams,
	percentOfUsefulProduct,
}: Pick<
	IngredientFormState,
	"costPerPackInCentsExGst" | "packageSizeInGrams" | "percentOfUsefulProduct"
>): number | null {
	if (
		costPerPackInCentsExGst === null ||
		costPerPackInCentsExGst === undefined
	) {
		return null;
	}

	if (packageSizeInGrams === null || packageSizeInGrams === undefined) {
		return null;
	}

	if (packageSizeInGrams <= 0) {
		return null;
	}

	let usefulFraction = 1;
	if (percentOfUsefulProduct !== null && percentOfUsefulProduct !== undefined) {
		if (percentOfUsefulProduct <= 0) {
			return null;
		}
		usefulFraction = percentOfUsefulProduct / 100;
	}

	const usableGrams = packageSizeInGrams * usefulFraction;
	if (!Number.isFinite(usableGrams) || usableGrams <= 0) {
		return null;
	}

	const costPerGram = costPerPackInCentsExGst / usableGrams;
	const costPer1000g = costPerGram * 1000;
	if (!Number.isFinite(costPer1000g)) {
		return null;
	}

	return Math.round(costPer1000g);
}

interface UseIngredientFormParams {
	ingredient: IngredientWithSupplier | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	allIngredients: Ingredient[];
}

export function useIngredientForm({
	ingredient,
	open,
	onOpenChange,
	allIngredients,
}: UseIngredientFormParams) {
	const [state, dispatch] = useReducer(formReducer, EMPTY_FORM_STATE);
	const updateMutation = useUpdateIngredient();
	const { data: suppliersData } = useSuppliers({ pageSize: 100 });

	useEffect(() => {
		if (open && ingredient) {
			dispatch({ type: "initialize", ingredient });
		} else if (!open) {
			dispatch({ type: "reset" });
		}
	}, [open, ingredient]);

	const setFieldValue = useCallback(
		(
			field: keyof IngredientFormState,
			value: IngredientFormState[keyof IngredientFormState],
		) => {
			dispatch({ type: "update", field, value });
		},
		[],
	);

	const handleCancel = useCallback(() => {
		onOpenChange(false);
		dispatch({ type: "reset" });
	}, [onOpenChange]);

	const calculatedPac = useMemo(() => calculatePAC(state), [state]);
	const calculatedCostPer1000gInCentsExGst = useMemo(
		() =>
			calculateCostPer1000gInCentsExGst({
				costPerPackInCentsExGst: state.costPerPackInCentsExGst,
				packageSizeInGrams: state.packageSizeInGrams,
				percentOfUsefulProduct: state.percentOfUsefulProduct,
			}),
		[
			state.costPerPackInCentsExGst,
			state.packageSizeInGrams,
			state.percentOfUsefulProduct,
		],
	);

	const supplierOptions = useMemo(
		() =>
			suppliersData?.data?.map((supplier) => ({
				value: supplier.id,
				label: supplier.name,
			})) ?? [],
		[suppliersData?.data],
	);

	const uniqueCategories = useMemo(() => {
		const categories = new Set<string>();
		for (const item of allIngredients) {
			if (item.category) {
				categories.add(item.category);
			}
		}
		return Array.from(categories).sort();
	}, [allIngredients]);

	const uniqueTypes = useMemo(() => {
		const types = new Set<string>();
		for (const item of allIngredients) {
			if (item.type) {
				types.add(item.type);
			}
		}
		return Array.from(types).sort();
	}, [allIngredients]);

	const handleSave = useCallback(async () => {
		if (!ingredient || state.name.trim() === "") {
			return;
		}

		try {
			await updateMutation.mutateAsync({
				ingredientId: ingredient.id,
				updates: {
					name: state.name,
					category: state.category,
					type: state.type,
					status: state.status,
					brand: state.brand ? state.brand : null,
					supplierId: state.supplierId,
					energyPer100g: state.energyPer100g,
					proteinPer100g: state.proteinPer100g,
					totalFatPer100g: state.totalFatPer100g,
					saturatedFatPer100g: state.saturatedFatPer100g,
					totalCarbPer100g: state.totalCarbPer100g,
					totalSugarsPer100g: state.totalSugarsPer100g,
					sodiumMgPer100g: state.sodiumMgPer100g,
					waterPer100g: state.waterPer100g,
					totalSolidsPer100g: state.totalSolidsPer100g,
					otherSolidsPer100g: state.otherSolidsPer100g,
					msnfPer100g: state.msnfPer100g,
					dryCocoaSolidsPer100g: state.dryCocoaSolidsPer100g,
					cocoaButterPer100g: state.cocoaButterPer100g,
					sucrosePer100g: state.sucrosePer100g,
					fructosePer100g: state.fructosePer100g,
					glucosePer100g: state.glucosePer100g,
					dextrosePer100g: state.dextrosePer100g,
					alcoholPer100g: state.alcoholPer100g,
					otherSugarsPer100g: state.otherSugarsPer100g,
					hf: state.hf,
					pac: calculatedPac,
					pod: state.pod,
					packageSizeInGrams: state.packageSizeInGrams,
					costPerPackInCentsExGst: state.costPerPackInCentsExGst,
					costPer1000gInCentsExGst: calculatedCostPer1000gInCentsExGst,
					percentOfUsefulProduct: state.percentOfUsefulProduct,
					supplierCode: state.supplierCode ? state.supplierCode : null,
					foodCompositionId: state.foodCompositionId
						? state.foodCompositionId
						: null,
				},
			});
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to update ingredient:", error);
		}
	}, [
		calculatedCostPer1000gInCentsExGst,
		calculatedPac,
		ingredient,
		onOpenChange,
		state,
		updateMutation,
	]);

	return {
		state,
		setFieldValue,
		handleSave,
		handleCancel,
		isSaving: updateMutation.isPending,
		supplierOptions,
		uniqueCategories,
		uniqueTypes,
		calculatedPac,
		calculatedCostPer1000gInCentsExGst,
	};
}
