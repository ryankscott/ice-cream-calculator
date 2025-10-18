import { Router } from "express";
import type { DataSource } from "typeorm";

import { SupplierService } from "../services";

export function createSuppliersRouter(dataSource: DataSource) {
	const router = Router();
	const supplierService = new SupplierService(dataSource);

	router.get("/", async (req, res, next) => {
		try {
			const result = await supplierService.list(req.query);
			res.json(result);
		} catch (error) {
			next(error);
		}
	});

	router.post("/", async (req, res, next) => {
		try {
			const supplier = await supplierService.create(req.body);
			res.status(201).json(supplier);
		} catch (error) {
			next(error);
		}
	});

	router.get("/:supplierId", async (req, res, next) => {
		try {
			const supplier = await supplierService.getById(req.params.supplierId);
			res.json(supplier);
		} catch (error) {
			next(error);
		}
	});

	router.put("/:supplierId", async (req, res, next) => {
		try {
			const supplier = await supplierService.update({
				...req.body,
				id: req.params.supplierId,
			});
			res.json(supplier);
		} catch (error) {
			next(error);
		}
	});

	router.delete("/:supplierId", async (req, res, next) => {
		try {
			await supplierService.delete(req.params.supplierId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	});

	return router;
}
