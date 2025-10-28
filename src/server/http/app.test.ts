import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";

import request from "supertest";
import { DataSource } from "typeorm";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { Ingredient } from "../entities/Ingredient";
import { Recipe } from "../entities/Recipe";
import { Supplier } from "../entities/Supplier";
import { createApp } from "./app";

const requireModule = createRequire(import.meta.url);

let sqlite3Available = true;
try {
	requireModule("sqlite3");
} catch (error) {
	sqlite3Available = false;
	console.warn(
		"Skipping HTTP integration tests because sqlite3 native bindings are unavailable.",
		error,
	);
}

const describeIf = sqlite3Available ? describe : describe.skip;

describeIf("HTTP API", () => {
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

	it("exposes the OpenAPI document", async () => {
		const app = createApp(dataSource);

		const response = await request(app).get("/api/docs.json").expect(200);

		expect(response.body).toHaveProperty("openapi");
		expect(response.body.paths).toHaveProperty("/api/ingredients");
	});

	it("manages suppliers and ingredients end to end", async () => {
		const app = createApp(dataSource);
		const ingredientId = randomUUID();

		const supplierResponse = await request(app)
			.post("/api/suppliers")
			.send({ name: "API Supplier", email: "api@supplier.test" })
			.expect(201);

		const supplierId = supplierResponse.body.id;
		expect(supplierId).toBeDefined();

		const ingredientResponse = await request(app)
			.post("/api/ingredients")
			.send({
				id: ingredientId,
				name: "Gelato Base",
				supplierId,
				status: "Active",
				category: "Base",
				type: "Liquid",
			})
			.expect(201);

		expect(ingredientResponse.body.name).toBe("Gelato Base");

		const listResponse = await request(app)
			.get("/api/ingredients")
			.query({ supplierId })
			.expect(200);

		expect(listResponse.body.meta.totalItems).toBe(1);
		expect(listResponse.body.data[0].id).toBe(ingredientId);

		await request(app)
			.patch(`/api/ingredients/${ingredientId}/status`)
			.send({ status: "Inactive" })
			.expect(200);

		const detailResponse = await request(app)
			.get(`/api/ingredients/${ingredientId}`)
			.expect(200);

		expect(detailResponse.body.status).toBe("Inactive");

		await request(app).delete(`/api/ingredients/${ingredientId}`).expect(204);

		await request(app).delete(`/api/suppliers/${supplierId}`).expect(204);
	});

	it("prevents supplier deletion while ingredients exist", async () => {
		const app = createApp(dataSource);
		const ingredientId = randomUUID();

		const supplierResponse = await request(app)
			.post("/api/suppliers")
			.send({ name: "Supplier With Ingredient" })
			.expect(201);

		const supplierId = supplierResponse.body.id;

		await request(app)
			.post("/api/ingredients")
			.send({
				id: ingredientId,
				name: "Locked Ingredient",
				supplierId,
				status: "Active",
				category: "Test",
				type: "Powder",
			})
			.expect(201);

		const deleteResponse = await request(app)
			.delete(`/api/suppliers/${supplierId}`)
			.expect(400);

		expect(deleteResponse.body.message).toContain("associated ingredients");
	});

	it("manages recipes end to end", async () => {
		const app = createApp(dataSource);

		const supplierResponse = await request(app)
			.post("/api/suppliers")
			.send({ name: "Recipe Supplier" })
			.expect(201);

		const supplierId = supplierResponse.body.id;
		const ingredientId = randomUUID();

		await request(app)
			.post("/api/ingredients")
			.send({
				id: ingredientId,
				name: "Recipe Ingredient",
				supplierId,
				status: "Active",
				category: "Base",
				type: "Liquid",
			})
			.expect(201);

		const recipeId = randomUUID();

		const createResponse = await request(app)
			.post("/api/recipes")
			.send({
				id: recipeId,
				name: "House Gelato",
				type: "MilkBased",
				ingredients: [{ ingredientId, quantityInGrams: 250 }],
				inputParameters: {
					desiredPac: 200,
					desiredPacFromLactose: 40,
					desiredPacFromSucrose: 60,
					goalFatGramsPerBatch: 80,
					fatFromMilkPer100g: 35,
					goalMsnf: 11,
					neutroAmount: 6,
				},
			})
			.expect(201);

		expect(createResponse.body.name).toBe("House Gelato");
		expect(createResponse.body.ingredients[0].ingredientId).toBe(ingredientId);

		const listResponse = await request(app).get("/api/recipes").expect(200);

		expect(listResponse.body.meta.totalItems).toBe(1);
		expect(listResponse.body.data[0].id).toBe(recipeId);

		const filteredResponse = await request(app)
			.get("/api/recipes")
			.query({ type: "MilkBased" })
			.expect(200);

		expect(filteredResponse.body.data).toHaveLength(1);

		await request(app)
			.put(`/api/recipes/${recipeId}`)
			.send({
				name: "Updated Gelato",
				type: "MilkBased",
				ingredients: [{ ingredientId, quantityInGrams: 225 }],
				inputParameters: {
					desiredPac: 195,
					desiredPacFromLactose: 38,
					desiredPacFromSucrose: 58,
					goalFatGramsPerBatch: 78,
					fatFromMilkPer100g: 34,
					goalMsnf: 10.5,
					neutroAmount: 6,
				},
			})
			.expect(200);

		const detailResponse = await request(app)
			.get(`/api/recipes/${recipeId}`)
			.expect(200);

		expect(detailResponse.body.name).toBe("Updated Gelato");
		expect(detailResponse.body.inputParameters.desiredPac).toBe(195);

		await request(app).delete(`/api/recipes/${recipeId}`).expect(204);

		const emptyList = await request(app).get("/api/recipes").expect(200);

		expect(emptyList.body.meta.totalItems).toBe(0);
	});
});
