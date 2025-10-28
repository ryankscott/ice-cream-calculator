import "reflect-metadata";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DataSource } from "typeorm";

import { Ingredient } from "./entities/Ingredient";
import { Recipe } from "./entities/Recipe";
import { Supplier } from "./entities/Supplier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseFile =
	process.env.NODE_ENV === "test"
		? ":memory:"
		: path.resolve(process.cwd(), "data", "app.db");

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: databaseFile,
	entities: [Supplier, Ingredient, Recipe],
	migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
	migrationsTableName: "migrations",
	logging: false,
	synchronize: false,
});

export default AppDataSource;
