/* eslint-disable */
// Generated Zod schemas derived from schema/ingredients.yaml
import { z } from "zod";

const SupplierId = z.string();
const IngredientStatus = z.enum(["Active", "Inactive"]);
const IngredientAllergens = z.record(
  z.union([
    z.boolean(),
    z.string(),
    z.number(),
    z.object({}).partial().strict().passthrough(),
  ])
);
const IngredientBase = z
  .object({
    name: z.string(),
    supplierId: SupplierId.uuid(),
    status: IngredientStatus,
    category: z.string(),
    type: z.string(),
    brand: z.string().nullish(),
    foodCompositionId: z.string().nullish(),
    energyPer100g: z.number().nullish(),
    proteinPer100g: z.number().nullish(),
    totalFatPer100g: z.number().nullish(),
    saturatedFatPer100g: z.number().nullish(),
    totalCarbPer100g: z.number().nullish(),
    totalSugarsPer100g: z.number().nullish(),
    sodiumMgPer100g: z.number().nullish(),
    waterPer100g: z.number().nullish(),
    totalSolidsPer100g: z.number().nullish(),
    otherSolidsPer100g: z.number().nullish(),
    msnfPer100g: z.number().nullish(),
    sucrosePer100g: z.number().nullish(),
    fructosePer100g: z.number().nullish(),
    glucosePer100g: z.number().nullish(),
    dextrosePer100g: z.number().nullish(),
    alcoholPer100g: z.number().nullish(),
    otherSugarsPer100g: z.number().nullish(),
    pac: z.number().nullish(),
    pod: z.number().nullish(),
    hf: z.number().nullish(),
    dryCocoaSolidsPer100g: z.number().nullish(),
    cocoaButterPer100g: z.number().nullish(),
    supplierCode: z.string().nullish(),
    packageSizeInGrams: z.number().nullish(),
    costPerPackInCentsExGst: z.number().int().nullish(),
    costPer1000gInCentsExGst: z.number().int().nullish(),
    percentOfUsefulProduct: z.number().nullish(),
    allergens: IngredientAllergens.optional(),
  })
  .strict()
  .passthrough();
const IngredientId = z.string();
const DateTime = z.string();
const Ingredient = IngredientBase.and(
  z
    .object({
      id: IngredientId.uuid(),
      createdAt: DateTime.datetime({ offset: true }),
      lastModifiedAt: DateTime.datetime({ offset: true }),
    })
    .strict()
    .passthrough()
);
const PaginationMeta = z
  .object({
    page: z.number().int().gte(1),
    pageSize: z.number().int().gte(1),
    totalItems: z.number().int().gte(0),
    totalPages: z.number().int().gte(0),
  })
  .strict()
  .passthrough();
const IngredientListResponse = z
  .object({ data: z.array(Ingredient), meta: PaginationMeta })
  .strict()
  .passthrough();
const IngredientCreateInput = IngredientBase.and(
  z.object({ id: IngredientId.uuid() }).strict().passthrough()
);
const IngredientUpdateInput = IngredientBase.and(
  z.object({ id: IngredientId.uuid() }).strict().passthrough()
);
const IngredientStatusUpdateInput = z
  .object({ status: IngredientStatus })
  .strict()
  .passthrough();
const SupplierBase = z
  .object({
    name: z.string(),
    email: z.string().email().nullish(),
    phone: z.string().nullish(),
    address: z.string().nullish(),
    website: z.string().url().nullish(),
  })
  .strict()
  .passthrough();
const Supplier = SupplierBase.and(
  z
    .object({
      id: SupplierId.uuid(),
      createdAt: DateTime.datetime({ offset: true }),
      lastModifiedAt: DateTime.datetime({ offset: true }),
    })
    .strict()
    .passthrough()
);
const SupplierListResponse = z
  .object({ data: z.array(Supplier), meta: PaginationMeta })
  .strict()
  .passthrough();
const SupplierCreateInput = SupplierBase;
const SupplierUpdateInput = SupplierBase.and(
  z.object({ id: SupplierId.uuid() }).strict().passthrough()
);

export const schemas = {
  SupplierId,
  IngredientStatus,
  IngredientAllergens,
  IngredientBase,
  IngredientId,
  DateTime,
  Ingredient,
  PaginationMeta,
  IngredientListResponse,
  IngredientCreateInput,
  IngredientUpdateInput,
  IngredientStatusUpdateInput,
  SupplierBase,
  Supplier,
  SupplierListResponse,
  SupplierCreateInput,
  SupplierUpdateInput,
};
