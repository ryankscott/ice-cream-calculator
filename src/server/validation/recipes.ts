import { z } from "zod";

import { schemas } from "../generated/zod-schemas";

export const RecipeCreateSchema = schemas.RecipeCreateInput;
export type RecipeCreateInput = z.infer<typeof RecipeCreateSchema>;

export const RecipeUpdateSchema = schemas.RecipeUpdateInput;
export type RecipeUpdateInput = z.infer<typeof RecipeUpdateSchema>;

export const RecipeIdSchema = schemas.RecipeId.uuid();

export const RecipeListQuerySchema = z
	.object({
		type: schemas.RecipeType.optional(),
	})
	.strict();

export type RecipeListQuery = z.infer<typeof RecipeListQuerySchema>;

export function validateRecipeCreate(input: unknown): RecipeCreateInput {
	return RecipeCreateSchema.parse(input);
}

export function validateRecipeUpdate(input: unknown): RecipeUpdateInput {
	return RecipeUpdateSchema.parse(input);
}

export function validateRecipeListQuery(input: unknown): RecipeListQuery {
	return RecipeListQuerySchema.parse(input);
}
