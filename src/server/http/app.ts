import cors from "cors";
import express from "express";
import type { DataSource } from "typeorm";

import { createIngredientsRouter } from "../routes/ingredients";
import { createSuppliersRouter } from "../routes/suppliers";
import { errorHandler } from "./error-handler";
import { getOpenApiDocument } from "./openapi";

export function createApp(dataSource: DataSource) {
	const app = express();

	app.use(
		cors({
			origin: process.env.CORS_ORIGIN ?? true,
			credentials: false,
		}),
	);
	app.use(express.json());

	app.get("/api/docs.json", (_req, res) => {
		res.json(getOpenApiDocument());
	});

	app.use("/api/ingredients", createIngredientsRouter(dataSource));
	app.use("/api/suppliers", createSuppliersRouter(dataSource));

	app.use(errorHandler);

	return app;
}
