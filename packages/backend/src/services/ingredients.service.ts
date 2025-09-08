// Functional Programming Services Implementation
// Pure functions for business logic

import type { Database } from '../database/connection';
import type {
  Ingredient,
  Supplier,
  ID,
  GetIngredientsInput,
  GetIngredientsResponse,
  CreateIngredientRequest,
  UpdateIngredientRequest,
} from '@ice-cream-calculator/shared';

import {
  safeFindIngredients,
  safeFindIngredientById,
  safeCreateIngredient,
  safeUpdateIngredient,
  safeDeleteIngredient,
} from '../repositories/ingredients.repository';

// Pure functions for supplier operations
const findAllSuppliers = async (db: Database): Promise<Supplier[]> => {
  const sql = `
    SELECT * FROM suppliers 
    ORDER BY name ASC
  `;
  
  const rows = await db.all(sql);
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    contactInfo: {
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
    },
    website: row.website || '',
  }));
};

const findSupplierById = async (db: Database, id: ID): Promise<Supplier | null> => {
  const sql = 'SELECT * FROM suppliers WHERE id = ?';
  const row = await db.get(sql, [id]);
  
  if (!row) return null;
  
  return {
    id: row.id,
    name: row.name,
    contactInfo: {
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
    },
    website: row.website || '',
  };
};

const createSupplier = async (db: Database, data: Omit<Supplier, 'id'>): Promise<Supplier> => {
  const now = new Date().toISOString();
  const sql = `
    INSERT INTO suppliers (name, email, phone, address, website, created_at, last_modified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    data.name,
    data.contactInfo.email || null,
    data.contactInfo.phone || null,
    data.contactInfo.address || null,
    data.website || null,
    now,
    now,
  ];
  
  const result = await db.run(sql, values);
  
  if (!result.lastID) {
    throw new Error('Failed to create supplier');
  }
  
  const created = await findSupplierById(db, result.lastID.toString());
  if (!created) {
    throw new Error('Failed to retrieve created supplier');
  }
  
  return created;
};

// Service functions using function composition

export const createIngredientsService = (db: Database) => ({
  async getIngredients(params: GetIngredientsInput): Promise<GetIngredientsResponse> {
    return await safeFindIngredients(db, params);
  },

  async getIngredientById(id: ID): Promise<Ingredient> {
    const ingredient = await safeFindIngredientById(db, id);
    if (!ingredient) {
      throw new Error(`Ingredient with id ${id} not found`);
    }
    return ingredient;
  },

  async createIngredient(data: CreateIngredientRequest): Promise<Ingredient> {
    // Validate that supplier exists
    const supplier = await findSupplierById(db, data.supplierID);
    if (!supplier) {
      throw new Error(`Supplier with id ${data.supplierID} not found`);
    }

    return await safeCreateIngredient(db, data);
  },

  async updateIngredient(id: ID, updates: UpdateIngredientRequest): Promise<Ingredient> {
    // Check if ingredient exists
    const existing = await safeFindIngredientById(db, id);
    if (!existing) {
      throw new Error(`Ingredient with id ${id} not found`);
    }

    // If updating supplier, validate it exists
    if (updates.supplierID) {
      const supplier = await findSupplierById(db, updates.supplierID);
      if (!supplier) {
        throw new Error(`Supplier with id ${updates.supplierID} not found`);
      }
    }

    const updated = await safeUpdateIngredient(db, id, updates);
    if (!updated) {
      throw new Error(`Failed to update ingredient with id ${id}`);
    }

    return updated;
  },

  async deleteIngredient(id: ID): Promise<void> {
    const deleted = await safeDeleteIngredient(db, id);
    if (!deleted) {
      throw new Error(`Ingredient with id ${id} not found`);
    }
  },

  async getSuppliers(): Promise<Supplier[]> {
    return await findAllSuppliers(db);
  },
});

export const createSuppliersService = (db: Database) => ({
  async getSuppliers(): Promise<Supplier[]> {
    return await findAllSuppliers(db);
  },

  async getSupplierById(id: ID): Promise<Supplier> {
    const supplier = await findSupplierById(db, id);
    if (!supplier) {
      throw new Error(`Supplier with id ${id} not found`);
    }
    return supplier;
  },

  async createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    return await createSupplier(db, data);
  },
});

// Type definitions for the functional services
export type IngredientsService = ReturnType<typeof createIngredientsService>;
export type SuppliersService = ReturnType<typeof createSuppliersService>;
