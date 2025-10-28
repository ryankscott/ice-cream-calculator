import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { DataSource } from "typeorm";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { Ingredient } from "../entities/Ingredient";
import { Supplier } from "../entities/Supplier";
import { IngredientService } from "./ingredient-service";
import { SupplierService } from "./supplier-service";

const requireModule = createRequire(import.meta.url);

let sqlite3Available = true;
try {
	requireModule("sqlite3");
} catch (error) {
	sqlite3Available = false;
	console.warn(
		"Skipping IngredientService tests because sqlite3 native bindings are unavailable.",
		error,
	);
}

const describeIf = sqlite3Available ? describe : describe.skip;

describeIf("IngredientService", () => {
	let dataSource: DataSource;
	let ingredientService: IngredientService;
	let supplierService: SupplierService;

	beforeAll(async () => {
		dataSource = new DataSource({
			type: "sqlite",
			database: ":memory:",
			entities: [Supplier, Ingredient],
			synchronize: true,
			logging: false,
		});
		await dataSource.initialize();

		ingredientService = new IngredientService(dataSource);
		supplierService = new SupplierService(dataSource);
	});

	afterEach(async () => {
		if (!dataSource.isInitialized) return;
		await dataSource.getRepository(Ingredient).clear();
		await dataSource.getRepository(Supplier).clear();
	});

	afterAll(async () => {
		if (dataSource?.isInitialized) {
			await dataSource.destroy();
		}
	});

	it("creates and lists ingredients", async () => {
		const supplier = await supplierService.create({
			name: "Test Supplier",
			email: "supplier@example.com",
		});

		await ingredientService.create({
			id: randomUUID(),
			name: "Organic Milk Powder",
			supplierId: supplier.id,
			status: "Active",
			category: "Dairy",
			type: "Powder",
			allergens: { milk: true },
		});

		const result = await ingredientService.list({
			page: 1,
			pageSize: 10,
		});

		expect(result.meta.totalItems).toBe(1);
		expect(result.data[0]?.supplierId).toBe(supplier.id);
	});

	it("updates ingredient status", async () => {
		const supplier = await supplierService.create({
			name: "Status Supplier",
		});

		const ingredient = await ingredientService.create({
			id: randomUUID(),
			name: "Cocoa Butter",
			supplierId: supplier.id,
			status: "Active",
			category: "Cocoa",
			type: "Fat",
		});

		const updated = await ingredientService.updateStatus(ingredient.id, {
			status: "Inactive",
		});

		expect(updated.status).toBe("Inactive");
	});

	it("throws when supplier is missing on create", async () => {
		await expect(
			ingredientService.create({
				id: randomUUID(),
				name: "Mystery Ingredient",
				supplierId: randomUUID(),
				status: "Active",
				category: "Unknown",
				type: "Unknown",
			}),
		).rejects.toMatchObject({
			name: "NotFoundError",
			status: 404,
		});
	});
});
