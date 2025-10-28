import type { DataSource, Repository } from "typeorm";

import { Ingredient } from "../entities/Ingredient";
import { Supplier } from "../entities/Supplier";
import {
	IngredientCreateSchema,
	IngredientListQuerySchema,
	IngredientStatusUpdateSchema,
	IngredientUpdateSchema,
} from "../validation";
import { NotFoundError, ValidationError } from "./errors";

export class IngredientService {
	private readonly ingredientRepo: Repository<Ingredient>;
	private readonly supplierRepo: Repository<Supplier>;

	constructor(private readonly dataSource: DataSource) {
		this.ingredientRepo = this.dataSource.getRepository(Ingredient);
		this.supplierRepo = this.dataSource.getRepository(Supplier);
	}

	async list(rawFilters: unknown) {
		const filters = IngredientListQuerySchema.parse(rawFilters);
		const { status, category, supplierId } = filters;

		const qb = this.ingredientRepo
			.createQueryBuilder("ingredient")
			.leftJoinAndSelect("ingredient.supplier", "supplier");

		if (status) {
			qb.andWhere("ingredient.status = :status", { status });
		}

		if (category) {
			qb.andWhere("ingredient.category = :category", { category });
		}

		if (supplierId) {
			qb.andWhere("ingredient.supplier_id = :supplierId", { supplierId });
		}

		const data = await qb.getMany();

		return {
			data,
			meta: {
				totalItems: data.length,
			},
		};
	}

	async getById(id: string) {
		const ingredient = await this.ingredientRepo.findOne({
			where: { id },
			relations: ["supplier"],
		});

		if (!ingredient) {
			throw new NotFoundError("Ingredient", { id });
		}

		return ingredient;
	}

	async create(rawInput: unknown) {
		const parsed = IngredientCreateSchema.safeParse(rawInput);
		if (!parsed.success) {
			throw new ValidationError("Invalid ingredient payload", {
				issues: parsed.error.issues,
			});
		}

		const supplier = await this.ensureSupplierExists(parsed.data.supplierId);

		const now = new Date().toISOString();
		const record = this.ingredientRepo.create({
			...parsed.data,
			supplier,
			createdAt: now,
			lastModifiedAt: now,
			allergens: parsed.data.allergens ?? {},
		});

		return await this.ingredientRepo.save(record);
	}

	async update(rawInput: unknown) {
		const parsed = IngredientUpdateSchema.safeParse(rawInput);
		if (!parsed.success) {
			throw new ValidationError("Invalid ingredient payload", {
				issues: parsed.error.issues,
			});
		}

		const existing = await this.ingredientRepo.findOne({
			where: { id: parsed.data.id },
		});
		if (!existing) {
			throw new NotFoundError("Ingredient", { id: parsed.data.id });
		}

		const supplier = await this.ensureSupplierExists(parsed.data.supplierId);
		const updated: Ingredient = {
			...existing,
			...parsed.data,
			supplier,
			lastModifiedAt: new Date().toISOString(),
			allergens: parsed.data.allergens ?? existing.allergens ?? {},
		};

		return await this.ingredientRepo.save(updated);
	}

	async updateStatus(id: string, rawInput: unknown) {
		const parsed = IngredientStatusUpdateSchema.safeParse(rawInput);
		if (!parsed.success) {
			throw new ValidationError("Invalid status payload", {
				issues: parsed.error.issues,
			});
		}

		const ingredient = await this.getById(id);
		ingredient.status = parsed.data.status;
		ingredient.lastModifiedAt = new Date().toISOString();

		return await this.ingredientRepo.save(ingredient);
	}

	async delete(id: string) {
		const ingredient = await this.ingredientRepo.findOne({
			where: { id },
		});
		if (!ingredient) {
			throw new NotFoundError("Ingredient", { id });
		}

		await this.ingredientRepo.remove(ingredient);
	}

	private async ensureSupplierExists(supplierId: string) {
		const supplier = await this.supplierRepo.findOne({
			where: { id: supplierId },
		});
		if (!supplier) {
			throw new NotFoundError("Supplier", { id: supplierId });
		}
		return supplier;
	}
}
