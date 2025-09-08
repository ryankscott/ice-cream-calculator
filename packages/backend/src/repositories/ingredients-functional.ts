// Functional Programming Repository Implementation
// Pure functions for data access operations

import type { Database } from '../database/connection-functional';
import type {
  Ingredient,
  CreateIngredientRequest,
  UpdateIngredientRequest,
  GetIngredientsInput,
  GetIngredientsResponse,
  PaginationMeta,
  ID,
} from '@ice-cream-calculator/shared';

// Pure function types for repository operations
export type FindIngredientsOperation = (
  db: Database,
  input: GetIngredientsInput
) => Promise<GetIngredientsResponse>;

export type FindIngredientByIdOperation = (
  db: Database,
  id: ID
) => Promise<Ingredient | null>;

export type CreateIngredientOperation = (
  db: Database,
  data: CreateIngredientRequest
) => Promise<Ingredient>;

export type UpdateIngredientOperation = (
  db: Database,
  id: ID,
  data: UpdateIngredientRequest
) => Promise<Ingredient | null>;

export type DeleteIngredientOperation = (
  db: Database,
  id: ID
) => Promise<boolean>;

// Helper pure functions for data transformation
const mapRowToIngredient = (row: any): Ingredient => ({
  id: row.id,
  name: row.name,
  supplierID: row.supplier_id,
  supplier: {
    id: row.supplier_id,
    name: row.supplier_name || 'Unknown Supplier',
    contactInfo: {
      email: row.supplier_email || '',
      phone: row.supplier_phone || '',
      address: row.supplier_address || '',
    },
    website: row.supplier_website || '',
  },
  status: row.status,
  category: row.category,
  type: row.type,
  brand: row.brand,
  foodCompositionID: row.food_composition_id,
  energyPer100g: row.energy_per_100g,
  proteinPer100g: row.protein_per_100g,
  totalFatPer100g: row.total_fat_per_100g,
  saturatedFatPer100g: row.saturated_fat_per_100g,
  totalCarbPer100g: row.total_carb_per_100g,
  totalSugarsPer100g: row.total_sugars_per_100g,
  sodiumMgPer100g: row.sodium_mg_per_100g,
  waterPer100g: row.water_per_100g,
  totalSolidsPer100g: row.total_solids_per_100g,
  otherSolidsPer100g: row.other_solids_per_100g,
  MSNFPer100g: row.msnf_per_100g,
  sugarsPer100g: {
    sucrose: row.sucrose_per_100g,
    fructose: row.fructose_per_100g,
    glucose: row.glucose_per_100g,
    dextrose: row.dextrose_per_100g,
    alcohol: row.alcohol_sugars_per_100g,
    other: row.other_sugars_per_100g,
  },
  PAC: row.pac,
  POD: row.pod,
  HF: row.hf,
  dryCocoaSolidsPer100g: row.dry_cocoa_solids_per_100g,
  cocoaButterPer100g: row.cocoa_butter_per_100g,
  supplierCode: row.supplier_code,
  packageSizeInGrams: row.package_size_in_grams,
  costPerPackInCentsExGST: row.cost_per_pack_in_cents_ex_gst,
  costPer1000gInCentsExGST: row.cost_per_1000g_in_cents_ex_gst,
  percentOfUsefulProduct: row.percent_of_useful_product,
  allergens: row.allergens ? JSON.parse(row.allergens) : [],
  createdAt: row.created_at,
  lastModifiedAt: row.last_modified_at,
});

const mapIngredientToRow = (ingredient: any): any[] => {
  const base = [
    ingredient.name,
    ingredient.supplierID,
    ingredient.status,
    ingredient.category,
    ingredient.type,
    ingredient.brand || null,
    ingredient.foodCompositionID || null,
    ingredient.energyPer100g || null,
    ingredient.proteinPer100g || null,
    ingredient.totalFatPer100g || null,
    ingredient.saturatedFatPer100g || null,
    ingredient.totalCarbPer100g || null,
    ingredient.totalSugarsPer100g || null,
    ingredient.sodiumMgPer100g || null,
    ingredient.waterPer100g || null,
    ingredient.totalSolidsPer100g || null,
    ingredient.otherSolidsPer100g || null,
    ingredient.MSNFPer100g || null,
    ingredient.sugarsPer100g?.sucrose || null,
    ingredient.sugarsPer100g?.fructose || null,
    ingredient.sugarsPer100g?.glucose || null,
    ingredient.sugarsPer100g?.dextrose || null,
    ingredient.sugarsPer100g?.alcohol || null,
    ingredient.sugarsPer100g?.other || null,
    ingredient.PAC || null,
    ingredient.POD || null,
    ingredient.HF || null,
    ingredient.dryCocoaSolidsPer100g || null,
    ingredient.cocoaButterPer100g || null,
    ingredient.supplierCode || null,
    ingredient.packageSizeInGrams || null,
    ingredient.costPerPackInCentsExGST || null,
    ingredient.costPer1000gInCentsExGST || null,
    ingredient.percentOfUsefulProduct || null,
    JSON.stringify(ingredient.allergens || []),
  ];
  
  // Add timestamps for create operations
  if (ingredient.createdAt && ingredient.lastModifiedAt) {
    return [...base, ingredient.createdAt, ingredient.lastModifiedAt];
  }
  
  // Add only lastModifiedAt for update operations
  return [...base, new Date().toISOString()];
};

// Pure function to build WHERE clause conditions
const buildWhereConditions = (input: GetIngredientsInput): { clause: string; params: any[] } => {
  const conditions: string[] = [];
  const params: any[] = [];
  
  if (input.search) {
    conditions.push('(name LIKE ? OR brand LIKE ? OR supplier_code LIKE ?)');
    const searchPattern = `%${input.search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }
  
  if (input.category) {
    conditions.push('category = ?');
    params.push(input.category);
  }
  
  if (input.status) {
    conditions.push('status = ?');
    params.push(input.status);
  }
  
  if (input.type) {
    conditions.push('type = ?');
    params.push(input.type);
  }
  
  const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { clause, params };
};

// Pure function to build pagination
const buildPagination = (input: GetIngredientsInput): { limit: number; offset: number } => {
  const page = Math.max(1, input.page || 1);
  const limit = Math.min(100, Math.max(1, input.limit || 10));
  const offset = (page - 1) * limit;
  
  return { limit, offset };
};

// Repository operations as pure functions

export const findIngredients: FindIngredientsOperation = async (db, input) => {
  const { clause: whereClause, params: whereParams } = buildWhereConditions(input);
  const { limit, offset } = buildPagination(input);
  
  // Count total records
  const countSql = `SELECT COUNT(*) as count FROM ingredients ${whereClause}`;
  const countResult = await db.get(countSql, whereParams);
  const total = countResult?.count || 0;
  
  // Fetch paginated data
  const dataSql = `
    SELECT i.*, s.name as supplier_name, s.email as supplier_email, 
           s.phone as supplier_phone, s.address as supplier_address, 
           s.website as supplier_website, s.created_at as supplier_created_at,
           s.last_modified_at as supplier_last_modified_at
    FROM ingredients i
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    ${whereClause}
    ORDER BY i.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  const rows = await db.all(dataSql, [...whereParams, limit, offset]);
  
  // Transform rows to include supplier data
  const ingredients = rows.map(row => mapRowToIngredient(row));
  
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  
  return {
    success: true,
    data: {
      ingredients,
      pagination: {
        currentPage,
        totalPages,
        totalCount: total,
        pageSize: limit,
      },
    },
  };
};

export const findIngredientById: FindIngredientByIdOperation = async (db, id) => {
  const sql = `
    SELECT i.*, s.name as supplier_name, s.email as supplier_email,
           s.phone as supplier_phone, s.address as supplier_address,
           s.website as supplier_website, s.created_at as supplier_created_at,
           s.last_modified_at as supplier_last_modified_at
    FROM ingredients i
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    WHERE i.id = ?
  `;
  
  const row = await db.get(sql, [id]);
  if (!row) return null;
  
  return mapRowToIngredient(row);
};

export const createIngredient: CreateIngredientOperation = async (db, data) => {
  const now = new Date().toISOString();
  const ingredientData = { ...data, createdAt: now, lastModifiedAt: now };
  const values = mapIngredientToRow(ingredientData);
  
  const sql = `
    INSERT INTO ingredients (
      name, supplier_id, status, category, type, brand, food_composition_id,
      energy_per_100g, protein_per_100g, total_fat_per_100g, saturated_fat_per_100g,
      total_carb_per_100g, total_sugars_per_100g, sodium_mg_per_100g, water_per_100g,
      total_solids_per_100g, other_solids_per_100g, msnf_per_100g,
      sucrose_per_100g, fructose_per_100g, glucose_per_100g, dextrose_per_100g,
      alcohol_sugars_per_100g, other_sugars_per_100g,
      pac, pod, hf, dry_cocoa_solids_per_100g, cocoa_butter_per_100g,
      supplier_code, package_size_in_grams, cost_per_pack_in_cents_ex_gst,
      cost_per_1000g_in_cents_ex_gst, percent_of_useful_product,
      allergens, created_at, last_modified_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const result = await db.run(sql, values);
  
  if (!result.lastID) {
    throw new Error('Failed to create ingredient');
  }
  
  const created = await findIngredientById(db, result.lastID.toString());
  if (!created) {
    throw new Error('Failed to retrieve created ingredient');
  }
  
  return created;
};

export const updateIngredient: UpdateIngredientOperation = async (db, id, data) => {
  const existing = await findIngredientById(db, id);
  if (!existing) return null;
  
  const updatedData = { ...data, lastModifiedAt: new Date().toISOString() };
  const values = mapIngredientToRow(updatedData);
  
  const sql = `
    UPDATE ingredients SET
      name = ?, supplier_id = ?, status = ?, category = ?, type = ?, brand = ?,
      food_composition_id = ?, energy_per_100g = ?, protein_per_100g = ?,
      total_fat_per_100g = ?, saturated_fat_per_100g = ?, total_carb_per_100g = ?,
      total_sugars_per_100g = ?, sodium_mg_per_100g = ?, water_per_100g = ?,
      total_solids_per_100g = ?, other_solids_per_100g = ?, msnf_per_100g = ?,
      sucrose_per_100g = ?, fructose_per_100g = ?, glucose_per_100g = ?,
      dextrose_per_100g = ?, alcohol_sugars_per_100g = ?, other_sugars_per_100g = ?,
      pac = ?, pod = ?, hf = ?, dry_cocoa_solids_per_100g = ?, cocoa_butter_per_100g = ?,
      supplier_code = ?, package_size_in_grams = ?, cost_per_pack_in_cents_ex_gst = ?,
      cost_per_1000g_in_cents_ex_gst = ?, percent_of_useful_product = ?,
      allergens = ?, last_modified_at = ?
    WHERE id = ?
  `;
  
  await db.run(sql, [...values, id]);
  
  const updated = await findIngredientById(db, id);
  return updated;
};

export const deleteIngredient: DeleteIngredientOperation = async (db, id) => {
  const existing = await findIngredientById(db, id);
  if (!existing) return false;
  
  const sql = 'DELETE FROM ingredients WHERE id = ?';
  const result = await db.run(sql, [id]);
  
  return (result.changes || 0) > 0;
};

// Higher-order functions for composition
export const withTransaction = <T extends any[], R>(
  operation: (db: Database, ...args: T) => Promise<R>
) => {
  return async (db: Database, ...args: T): Promise<R> => {
    // In a real implementation, this would handle transactions
    // For in-memory database, we just execute the operation
    return await operation(db, ...args);
  };
};

export const withErrorHandling = <T extends any[], R>(
  operation: (db: Database, ...args: T) => Promise<R>
) => {
  return async (db: Database, ...args: T): Promise<R> => {
    try {
      return await operation(db, ...args);
    } catch (error) {
      throw new Error(`Repository operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
};

// Composed operations using function composition
export const safeCreateIngredient = withErrorHandling(withTransaction(createIngredient));
export const safeUpdateIngredient = withErrorHandling(withTransaction(updateIngredient));
export const safeDeleteIngredient = withErrorHandling(withTransaction(deleteIngredient));
export const safeFindIngredients = withErrorHandling(findIngredients);
export const safeFindIngredientById = withErrorHandling(findIngredientById);
