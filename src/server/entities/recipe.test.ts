import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { Ingredient } from "./Ingredient";
import { Recipe } from "./Recipe";
import { Supplier } from "./Supplier";

const requireModule = createRequire(import.meta.url);

let sqlite3Available = true;
try {
	requireModule("sqlite3");
} catch (error) {
	sqlite3Available = false;
	console.warn(
		"Skipping Recipe entity mapping tests because sqlite3 native bindings are unavailable.",
		error,
	);
}

const describeIf = sqlite3Available ? describe : describe.skip;

describeIf("Recipe entity mappings", () => {
	let dataSource: DataSource;

	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			entities: [Supplier, Ingredient, Recipe],
			synchronize: true,
			logging: false,
		});

		await dataSource.initialize();
	});

	afterAll(async () => {
		if (dataSource?.isInitialized) {
			await dataSource.destroy();
		}
	});

	it("persists ingredient list and parameters as JSON", async () => {
		const supplierRepo = dataSource.getRepository(Supplier);
		const ingredientRepo = dataSource.getRepository(Ingredient);
		const recipeRepo = dataSource.getRepository(Recipe);

		const supplier = supplierRepo.create({
			id: randomUUID(),
			name: "Recipe Supplier",
		});
		await supplierRepo.save(supplier);

		const ingredient = ingredientRepo.create({
			id: randomUUID(),
			name: "Whole Milk",
			supplier,
			status: "Active",
			category: "Dairy",
			type: "Liquid",
		});
		await ingredientRepo.save(ingredient);

		const recipe = recipeRepo.create({
			id: randomUUID(),
			name: "Test Gelato",
			type: "MilkBased",
			ingredients: [{ ingredientId: ingredient.id, quantityInGrams: 250 }],
			inputParameters: {
				desiredPac: 220,
				desiredPacFromLactose: 45,
				desiredPacFromSucrose: 60,
				goalFatGramsPerBatch: 80,
				fatFromMilkPer100g: 40,
				goalMsnf: 11,
				neutroAmount: 6,
			},
			notes: "Stored via JSON",
			calculatedOutputs: null,
		});

		await recipeRepo.save(recipe);

		const stored = await recipeRepo.findOneByOrFail({ id: recipe.id });

		expect(stored.ingredients).toEqual([
			{ ingredientId: ingredient.id, quantityInGrams: 250 },
		]);
		expect(stored.inputParameters.goalFatGramsPerBatch).toBe(80);
		expect(stored.notes).toBe("Stored via JSON");
		expect(stored.calculatedOutputs).toBeNull();
	});
});
