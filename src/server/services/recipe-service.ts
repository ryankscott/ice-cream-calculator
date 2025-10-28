import { type DataSource, In, type Repository } from "typeorm";

import { Ingredient } from "../entities/Ingredient";
import { Recipe } from "../entities/Recipe";
import {
	RecipeCreateSchema,
	RecipeListQuerySchema,
	RecipeUpdateSchema,
} from "../validation";
import { NotFoundError, ValidationError } from "./errors";

export class RecipeService {
	private readonly recipeRepo: Repository<Recipe>;
	private readonly ingredientRepo: Repository<Ingredient>;

	constructor(private readonly dataSource: DataSource) {
		this.recipeRepo = this.dataSource.getRepository(Recipe);
		this.ingredientRepo = this.dataSource.getRepository(Ingredient);
	}

	async list(rawFilters: unknown) {
		const filters = RecipeListQuerySchema.parse(rawFilters ?? {});

		const qb = this.recipeRepo.createQueryBuilder("recipe");

		if (filters.type) {
			qb.where("recipe.type = :type", { type: filters.type });
		}

		qb.orderBy("recipe.name", "ASC");

		const data = await qb.getMany();

		return {
			data,
			meta: {
				totalItems: data.length,
			},
		};
	}

	async getById(id: string) {
		const recipe = await this.recipeRepo.findOne({ where: { id } });

		if (!recipe) {
			throw new NotFoundError("Recipe", { id });
		}

		return recipe;
	}

	async create(rawInput: unknown) {
		const parsed = RecipeCreateSchema.safeParse(rawInput);
		if (!parsed.success) {
			throw new ValidationError("Invalid recipe payload", {
				issues: parsed.error.issues,
			});
		}

		await this.ensureIngredientsExist(
			parsed.data.ingredients.map((ingredient) => ingredient.ingredientId),
		);

		const now = new Date().toISOString();
		const record = this.recipeRepo.create({
			...parsed.data,
			notes: parsed.data.notes ?? null,
			createdAt: now,
			lastModifiedAt: now,
			calculatedOutputs: null,
		});

		return await this.recipeRepo.save(record);
	}

	async update(rawInput: unknown) {
		const parsed = RecipeUpdateSchema.safeParse(rawInput);
		if (!parsed.success) {
			throw new ValidationError("Invalid recipe payload", {
				issues: parsed.error.issues,
			});
		}

		const existing = await this.recipeRepo.findOne({
			where: { id: parsed.data.id },
		});
		if (!existing) {
			throw new NotFoundError("Recipe", { id: parsed.data.id });
		}

		await this.ensureIngredientsExist(
			parsed.data.ingredients.map((ingredient) => ingredient.ingredientId),
		);

		const updated: Recipe = {
			...existing,
			...parsed.data,
			notes: parsed.data.notes ?? null,
			lastModifiedAt: new Date().toISOString(),
			calculatedOutputs: existing.calculatedOutputs ?? null,
		};

		return await this.recipeRepo.save(updated);
	}

	async delete(id: string) {
		const recipe = await this.recipeRepo.findOne({ where: { id } });
		if (!recipe) {
			throw new NotFoundError("Recipe", { id });
		}

		await this.recipeRepo.remove(recipe);
	}

	private async ensureIngredientsExist(ingredientIds: string[]) {
		const uniqueIds = Array.from(new Set(ingredientIds));
		if (uniqueIds.length === 0) {
			throw new ValidationError("Recipe must include at least one ingredient");
		}

		const existing = await this.ingredientRepo.find({
			where: { id: In(uniqueIds) },
			select: ["id"],
		});

		const foundIds = new Set(existing.map((item) => item.id));
		const missing = uniqueIds.filter((id) => !foundIds.has(id));

		if (missing.length > 0) {
			throw new NotFoundError("Ingredient", { missingIds: missing });
		}
	}
}
