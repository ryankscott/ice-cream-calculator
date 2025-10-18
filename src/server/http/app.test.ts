import "reflect-metadata";

import { createRequire } from "node:module";

import request from "supertest";
import { DataSource } from "typeorm";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { Ingredient } from "../entities/Ingredient";
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
			entities: [Supplier, Ingredient],
			synchronize: true,
			logging: false,
		});
		await dataSource.initialize();
	});

	afterEach(async () => {
		if (!dataSource.isInitialized) return;
		await dataSource.getRepository(Ingredient).delete({});
		await dataSource.getRepository(Supplier).delete({});
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

		const supplierResponse = await request(app)
			.post("/api/suppliers")
			.send({ name: "API Supplier", email: "api@supplier.test" })
			.expect(201);

		const supplierId = supplierResponse.body.id;
		expect(supplierId).toBeDefined();

		const ingredientResponse = await request(app)
			.post("/api/ingredients")
			.send({
				id: "ingredient-1",
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
		expect(listResponse.body.data[0].id).toBe("ingredient-1");

		await request(app)
			.patch("/api/ingredients/ingredient-1/status")
			.send({ status: "Inactive" })
			.expect(200);

		const detailResponse = await request(app)
			.get("/api/ingredients/ingredient-1")
			.expect(200);

		expect(detailResponse.body.status).toBe("Inactive");

		await request(app).delete("/api/ingredients/ingredient-1").expect(204);

		await request(app).delete(`/api/suppliers/${supplierId}`).expect(204);
	});

	it("prevents supplier deletion while ingredients exist", async () => {
		const app = createApp(dataSource);

		const supplierResponse = await request(app)
			.post("/api/suppliers")
			.send({ name: "Supplier With Ingredient" })
			.expect(201);

		const supplierId = supplierResponse.body.id;

		await request(app)
			.post("/api/ingredients")
			.send({
				id: "locked-ingredient",
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
});
