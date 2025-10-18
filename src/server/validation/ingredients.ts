import { z } from "zod";

import { schemas } from "../generated/zod-schemas";

export const IngredientCreateSchema = schemas.IngredientCreateInput;
export type IngredientCreateInput = z.infer<typeof IngredientCreateSchema>;

export const IngredientUpdateSchema = schemas.IngredientUpdateInput;
export type IngredientUpdateInput = z.infer<typeof IngredientUpdateSchema>;

export const IngredientStatusUpdateSchema = schemas.IngredientStatusUpdateInput;
export type IngredientStatusUpdateInput = z.infer<
	typeof IngredientStatusUpdateSchema
>;

export const IngredientIdSchema = schemas.IngredientId.uuid();

export const IngredientListQuerySchema = z
	.object({
		status: schemas.IngredientStatus.optional(),
		category: z.string().min(1).optional(),
		supplierId: schemas.SupplierId.uuid().optional(),
	})
	.strict();

export type IngredientListQuery = z.infer<typeof IngredientListQuerySchema>;

export function validateIngredientCreate(
	input: unknown,
): IngredientCreateInput {
	return IngredientCreateSchema.parse(input);
}

export function validateIngredientUpdate(
	input: unknown,
): IngredientUpdateInput {
	return IngredientUpdateSchema.parse(input);
}

export function validateIngredientStatusUpdate(
	input: unknown,
): IngredientStatusUpdateInput {
	return IngredientStatusUpdateSchema.parse(input);
}

export function validateIngredientListQuery(
	input: unknown,
): IngredientListQuery {
	return IngredientListQuerySchema.parse(input);
}
