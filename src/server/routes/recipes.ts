import { Router } from "express";
import type { DataSource } from "typeorm";

import { RecipeService } from "../services";

export function createRecipesRouter(dataSource: DataSource) {
	const router = Router();
	const recipeService = new RecipeService(dataSource);

	router.get("/", async (req, res, next) => {
		try {
			const result = await recipeService.list(req.query);
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	router.post("/", async (req, res, next) => {
		try {
			const recipe = await recipeService.create(req.body);
			res.status(201).json(recipe);
		} catch (error) {
			next(error);
		}
	});

	router.get("/:recipeId", async (req, res, next) => {
		try {
			const recipe = await recipeService.getById(req.params.recipeId);
			res.json(recipe);
		} catch (error) {
			next(error);
		}
	});

	router.put("/:recipeId", async (req, res, next) => {
		try {
			const recipe = await recipeService.update({
				...req.body,
				id: req.params.recipeId,
			});
			res.json(recipe);
		} catch (error) {
			next(error);
		}
	});

	router.delete("/:recipeId", async (req, res, next) => {
		try {
			await recipeService.delete(req.params.recipeId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	});

	return router;
}
