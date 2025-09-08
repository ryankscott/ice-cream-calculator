import { z } from 'zod';
import type { 
  Ingredient, 
  CreateIngredientRequest,
  UpdateIngredientRequest,
  GetIngredientsResponse,
  CreateIngredientResponse,
  GetSuppliersResponse,
  ErrorResponse
} from '../types/api-generated';
import type { ID } from '../types/common';

// Legacy API wrapper types (keeping for backward compatibility)
export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  success: false;
}

// Re-export the generated types for convenience
export type {
  CreateIngredientRequest,
  UpdateIngredientRequest,
  GetIngredientsResponse,
  CreateIngredientResponse,
  GetSuppliersResponse,
  ErrorResponse,
  GetIngredientResponse,
  UpdateIngredientResponse,
  DeleteIngredientResponse
} from '../types/api-generated';

// Validation schemas using Zod
export const createIngredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  supplierID: z.string().min(1, 'Supplier is required'),
  status: z.enum(['Active', 'Inactive', 'Discontinued']),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['Wet', 'Dry']),
  brand: z.string().optional().default(''),
  foodCompositionID: z.string().optional().default(''),
  
  // Nutrition (all optional with defaults)
  energyPer100g: z.number().min(0).optional().default(0),
  proteinPer100g: z.number().min(0).optional().default(0),
  totalFatPer100g: z.number().min(0).optional().default(0),
  saturatedFatPer100g: z.number().min(0).optional().default(0),
  totalCarbPer100g: z.number().min(0).optional().default(0),
  totalSugarsPer100g: z.number().min(0).optional().default(0),
  sodiumMgPer100g: z.number().min(0).optional().default(0),
  waterPer100g: z.number().min(0).max(100).optional().default(0),
  totalSolidsPer100g: z.number().min(0).max(100).optional().default(0),
  otherSolidsPer100g: z.number().min(0).optional().default(0),
  MSNFPer100g: z.number().min(0).optional().default(0),
  
  // Sugars
  sugarsPer100g: z.object({
    sucrose: z.number().min(0).optional().default(0),
    fructose: z.number().min(0).optional().default(0),
    glucose: z.number().min(0).optional().default(0),
    dextrose: z.number().min(0).optional().default(0),
    alcohol: z.number().min(0).optional().default(0),
    other: z.number().min(0).optional().default(0),
  }).optional().default(() => ({
    sucrose: 0,
    fructose: 0,
    glucose: 0,
    dextrose: 0,
    alcohol: 0,
    other: 0,
  })),
  
  // Functional
  PAC: z.number().optional().default(0),
  POD: z.number().optional().default(0),
  HF: z.number().optional().default(0),
  dryCocoaSolidsPer100g: z.number().min(0).optional().default(0),
  cocoaButterPer100g: z.number().min(0).optional().default(0),
  
  // Commercial
  supplierCode: z.string().optional().default(''),
  packageSizeInGrams: z.number().min(0).optional().default(0),
  costPerPackInCentsExGST: z.number().min(0).optional().default(0),
  costPer1000gInCentsExGST: z.number().min(0).optional().default(0),
  percentOfUsefulProduct: z.number().min(0).max(100).optional().default(100),
  
  // Allergens - all optional, default to false
  allergens: z.object({
    wheat: z.boolean().optional().default(false),
    fish: z.boolean().optional().default(false),
    crustacean: z.boolean().optional().default(false),
    mollusc: z.boolean().optional().default(false),
    egg: z.boolean().optional().default(false),
    milk: z.boolean().optional().default(false),
    lupin: z.boolean().optional().default(false),
    peanut: z.boolean().optional().default(false),
    soy: z.boolean().optional().default(false),
    sesame: z.boolean().optional().default(false),
    almond: z.boolean().optional().default(false),
    brazilNut: z.boolean().optional().default(false),
    cashew: z.boolean().optional().default(false),
    hazelnut: z.boolean().optional().default(false),
    macadamia: z.boolean().optional().default(false),
    pecan: z.boolean().optional().default(false),
    pistachio: z.boolean().optional().default(false),
    pineNut: z.boolean().optional().default(false),
    walnut: z.boolean().optional().default(false),
    barley: z.boolean().optional().default(false),
    oats: z.boolean().optional().default(false),
    rye: z.boolean().optional().default(false),
    sulphites: z.boolean().optional().default(false),
  }).optional().default(() => ({
    wheat: false,
    fish: false,
    crustacean: false,
    mollusc: false,
    egg: false,
    milk: false,
    lupin: false,
    peanut: false,
    soy: false,
    sesame: false,
    almond: false,
    brazilNut: false,
    cashew: false,
    hazelnut: false,
    macadamia: false,
    pecan: false,
    pistachio: false,
    pineNut: false,
    walnut: false,
    barley: false,
    oats: false,
    rye: false,
    sulphites: false,
  }))
});

export const updateIngredientSchema = createIngredientSchema.partial();

export const getIngredientsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Discontinued']).optional(),
  type: z.enum(['Wet', 'Dry']).optional(),
});

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type GetIngredientsInput = z.infer<typeof getIngredientsSchema>;
