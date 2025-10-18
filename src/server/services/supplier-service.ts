import { randomUUID } from "node:crypto";

import type { DataSource, Repository } from "typeorm";

import { Supplier } from "../entities/Supplier";
import {
	SupplierCreateSchema,
	type SupplierListQuery,
	SupplierListQuerySchema,
	SupplierUpdateSchema,
} from "../validation";
import { NotFoundError, ValidationError } from "./errors";

export class SupplierService {
	private readonly supplierRepo: Repository<Supplier>;

	constructor(private readonly dataSource: DataSource) {
		this.supplierRepo = this.dataSource.getRepository(Supplier);
	}

	async list(rawQuery: unknown) {
		const query = SupplierListQuerySchema.parse(rawQuery);
		const { page, pageSize } = query;

		const [data, totalItems] = await this.supplierRepo.findAndCount({
			order: { name: "ASC" },
			skip: (page - 1) * pageSize,
			take: pageSize,
		});

		return {
			data,
			meta: buildPaginationMeta({ page, pageSize, totalItems }),
		};
	}

	async getById(id: string) {
		const supplier = await this.supplierRepo.findOne({
			where: { id },
		});

		if (!supplier) {
			throw new NotFoundError("Supplier", { id });
		}

		return supplier;
	}

	async create(rawInput: unknown) {
		const input = SupplierCreateSchema.safeParse(rawInput);
		if (!input.success) {
			throw new ValidationError("Invalid supplier payload", {
				issues: input.error.issues,
			});
		}

		const record = this.supplierRepo.create({
			id: input.data.id ?? randomUUID(),
			...input.data,
			createdAt: new Date().toISOString(),
			lastModifiedAt: new Date().toISOString(),
		});

		return await this.supplierRepo.save(record);
	}

	async update(rawInput: unknown) {
		const input = SupplierUpdateSchema.safeParse(rawInput);
		if (!input.success) {
			throw new ValidationError("Invalid supplier payload", {
				issues: input.error.issues,
			});
		}

		const existing = await this.supplierRepo.findOne({
			where: { id: input.data.id },
		});
		if (!existing) {
			throw new NotFoundError("Supplier", { id: input.data.id });
		}

		const updated: Supplier = {
			...existing,
			...input.data,
			lastModifiedAt: new Date().toISOString(),
		};

		return await this.supplierRepo.save(updated);
	}

	async delete(id: string) {
		const supplier = await this.supplierRepo.findOne({
			where: { id },
			relations: ["ingredients"],
		});
		if (!supplier) {
			throw new NotFoundError("Supplier", { id });
		}

		if (supplier.ingredients?.length) {
			throw new ValidationError("Supplier has associated ingredients", {
				ingredientIds: supplier.ingredients.map((ingredient) => ingredient.id),
			});
		}

		await this.supplierRepo.remove(supplier);
	}
}

function buildPaginationMeta({
	page,
	pageSize,
	totalItems,
}: SupplierListQuery & { totalItems: number }) {
	return {
		page,
		pageSize,
		totalItems,
		totalPages: Math.ceil(totalItems / pageSize),
	};
}
