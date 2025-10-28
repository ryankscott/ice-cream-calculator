import { Check, Column, Entity, Index, PrimaryColumn } from "typeorm";

export type RecipeType = "MilkBased" | "FruitBased" | "FruitWithFat";

export interface RecipeIngredient {
	ingredientId: string;
	quantityInGrams: number;
}

export interface RecipeInputParameters {
	desiredPac: number;
	desiredPacFromLactose: number;
	desiredPacFromSucrose: number;
	goalFatGramsPerBatch: number;
	fatFromMilkPer100g: number;
	goalMsnf: number;
	neutroAmount: number;
}

export interface RecipeCalculatedOutputs {
	totalDextroseToAdd: number;
	creamToAddInGrams: number;
	skimMilkPowderToAddInGrams: number;
	milkOrWaterToAddInGrams: number;
}

@Entity({ name: "recipes" })
@Check("type IN ('MilkBased','FruitBased','FruitWithFat')")
@Index("idx_recipes_type", ["type"])
export class Recipe {
	@PrimaryColumn("text")
	id!: string;

	@Column({ type: "text" })
	name!: string;

	@Column({ type: "text" })
	type!: RecipeType;

	@Column({ type: "text", nullable: true })
	notes!: string | null;

	@Column({ type: "simple-json", name: "ingredients" })
	ingredients!: RecipeIngredient[];

	@Column({ type: "simple-json", name: "input_parameters" })
	inputParameters!: RecipeInputParameters;

	@Column({
		type: "simple-json",
		name: "calculated_outputs",
		nullable: true,
	})
	calculatedOutputs!: RecipeCalculatedOutputs | null;

	@Column({
		type: "text",
		name: "created_at",
		default: () => "datetime('now')",
	})
	createdAt!: string;

	@Column({
		type: "text",
		name: "last_modified_at",
		default: () => "datetime('now')",
	})
	lastModifiedAt!: string;
}
