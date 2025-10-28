import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { DataSource } from "typeorm";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { Ingredient } from "../entities/Ingredient";
import { Recipe } from "../entities/Recipe";
import { Supplier } from "../entities/Supplier";
import { IngredientService } from "./ingredient-service";
import { RecipeService } from "./recipe-service";
import { SupplierService } from "./supplier-service";

const requireModule = createRequire(import.meta.url);

let sqlite3Available = true;
try {
	requireModule("sqlite3");
} catch (error) {
	sqlite3Available = false;
	console.warn(
		"Skipping RecipeService tests because sqlite3 native bindings are unavailable.",
		error,
	);
}

const describeIf = sqlite3Available ? describe : describe.skip;

describeIf("RecipeService", () => {
	let dataSource: DataSource;
	let recipeService: RecipeService;
	let ingredientService: IngredientService;
	let supplierService: SupplierService;

	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			entities: [Supplier, Ingredient, Recipe],
			synchronize: true,
			logging: false,
		});

		await dataSource.initialize();

		recipeService = new RecipeService(dataSource);
		ingredientService = new IngredientService(dataSource);
		supplierService = new SupplierService(dataSource);
	});

	afterEach(async () => {
		if (!dataSource.isInitialized) return;
		await dataSource.getRepository(Recipe).clear();
		await dataSource.getRepository(Ingredient).clear();
		await dataSource.getRepository(Supplier).clear();
	});

	afterAll(async () => {
		if (dataSource?.isInitialized) {
			await dataSource.destroy();
		}
	});

	async function createSupplierAndIngredient() {
		const supplier = await supplierService.create({
			name: "Recipe Supplier",
			email: "recipes@example.com",
		});

		const ingredient = await ingredientService.create({
			id: randomUUID(),
			name: "Whole Milk",
			supplierId: supplier.id,
			status: "Active",
			category: "Dairy",
			type: "Liquid",
		});

		return { supplier, ingredient };
	}

	const baseInputParameters = {
		desiredPac: 220,
		desiredPacFromLactose: 40,
		desiredPacFromSucrose: 60,
		goalFatGramsPerBatch: 80,
		fatFromMilkPer100g: 35,
		goalMsnf: 11,
		neutroAmount: 6,
	};

	it("creates and retrieves a recipe", async () => {
		const { ingredient } = await createSupplierAndIngredient();

		const recipe = await recipeService.create({
			id: randomUUID(),
			name: "Base Gelato",
			type: "MilkBased",
			notes: "House favourite",
			ingredients: [{ ingredientId: ingredient.id, quantityInGrams: 250 }],
			inputParameters: baseInputParameters,
		});

		const stored = await recipeService.getById(recipe.id);

		expect(stored.ingredients).toHaveLength(1);
		expect(stored.inputParameters.goalFatGramsPerBatch).toBe(80);
		expect(stored.notes).toBe("House favourite");
		expect(stored.calculatedOutputs).toBeNull();
	});

	it("filters recipes by type", async () => {
		const { ingredient } = await createSupplierAndIngredient();

		await recipeService.create({
			id: randomUUID(),
			name: "Milk Base",
			type: "MilkBased",
			ingredients: [{ ingredientId: ingredient.id, quantityInGrams: 200 }],
			inputParameters: baseInputParameters,
		});

		await recipeService.create({
			id: randomUUID(),
			name: "Fruit Sorbet",
			type: "FruitBased",
			ingredients: [{ ingredientId: ingredient.id, quantityInGrams: 180 }],
			inputParameters: baseInputParameters,
		});

		const filtered = await recipeService.list({ type: "FruitBased" });

		expect(filtered.data).toHaveLength(1);
		expect(filtered.data[0]?.type).toBe("FruitBased");
	});

	it("updates a recipe", async () => {
		const { ingredient } = await createSupplierAndIngredient();
		const recipe = await recipeService.create({
			id: randomUUID(),
			name: "Original Recipe",
			type: "MilkBased",
			ingredients: [{ ingredientId: ingredient.id, quantityInGrams: 220 }],
			inputParameters: baseInputParameters,
		});

		const updated = await recipeService.update({
			id: recipe.id,
			name: "Remixed Recipe",
			type: "MilkBased",
			ingredients: [{ ingredientId: ingredient.id, quantityInGrams: 200 }],
			inputParameters: {
				...baseInputParameters,
				desiredPac: 215,
			},
		});

		expect(updated.name).toBe("Remixed Recipe");
		expect(updated.inputParameters.desiredPac).toBe(215);
		expect(updated.lastModifiedAt).not.toBe(recipe.lastModifiedAt);
	});

	it("throws when an ingredient reference is missing", async () => {
		await createSupplierAndIngredient();

		await expect(
			recipeService.create({
				id: randomUUID(),
				name: "Bad Recipe",
				type: "MilkBased",
				ingredients: [{ ingredientId: randomUUID(), quantityInGrams: 100 }],
				inputParameters: baseInputParameters,
			}),
		).rejects.toMatchObject({
			name: "NotFoundError",
			status: 404,
		});
	});
});
