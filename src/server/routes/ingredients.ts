import { Router } from "express";
import type { DataSource } from "typeorm";

import { IngredientService } from "../services";

export function createIngredientsRouter(dataSource: DataSource) {
	const router = Router();
	const ingredientService = new IngredientService(dataSource);

	router.get("/", async (req, res, next) => {
		try {
			const result = await ingredientService.list(req.query);
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	router.post("/", async (req, res, next) => {
		try {
			const ingredient = await ingredientService.create(req.body);
			res.status(201).json(ingredient);
		} catch (error) {
			next(error);
		}
	});

	router.get("/:ingredientId", async (req, res, next) => {
		try {
			const ingredient = await ingredientService.getById(
				req.params.ingredientId,
			);
			res.json(ingredient);
		} catch (error) {
			next(error);
		}
	});

	router.put("/:ingredientId", async (req, res, next) => {
		try {
			const ingredient = await ingredientService.update({
				...req.body,
				id: req.params.ingredientId,
			});
			res.json(ingredient);
		} catch (error) {
			next(error);
		}
	});

	router.patch("/:ingredientId/status", async (req, res, next) => {
		try {
			const ingredient = await ingredientService.updateStatus(
				req.params.ingredientId,
				req.body,
			);
			res.json(ingredient);
		} catch (error) {
			next(error);
		}
	});

	router.delete("/:ingredientId", async (req, res, next) => {
		try {
			await ingredientService.delete(req.params.ingredientId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	});

	return router;
}
