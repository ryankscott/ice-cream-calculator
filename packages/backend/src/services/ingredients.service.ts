import type { Ingredient, Supplier, ID } from '@ice-cream-calculator/shared';
import type { GetIngredientsInput } from '@ice-cream-calculator/shared';
import { IngredientsRepository, SuppliersRepository, type PaginatedResult } from '../repositories/ingredients.repository';

export class IngredientsService {
  constructor(
    private ingredientsRepo: IngredientsRepository,
    private suppliersRepo: SuppliersRepository
  ) {}

  async getIngredients(params: GetIngredientsInput): Promise<PaginatedResult<Ingredient>> {
    const { page, limit, search, category, status, type } = params;
    
    return this.ingredientsRepo.findAllWithPagination(
      { page, limit },
      { search, category, status, type }
    );
  }

  async getIngredientById(id: ID): Promise<Ingredient> {
    const ingredient = await this.ingredientsRepo.findById(id);
    if (!ingredient) {
      throw new Error(`Ingredient with id ${id} not found`);
    }
    return ingredient;
  }

  async createIngredient(data: Omit<Ingredient, 'id' | 'createdAt' | 'lastModifiedAt' | 'supplier'>): Promise<Ingredient> {
    // Validate that supplier exists
    const supplier = await this.suppliersRepo.findById(data.supplierID);
    if (!supplier) {
      throw new Error(`Supplier with id ${data.supplierID} not found`);
    }

    // Create the ingredient with supplier reference
    const ingredientData = {
      ...data,
      supplier // This will be ignored in the repository, but we validate it exists
    };

    return this.ingredientsRepo.create(ingredientData);
  }

  async updateIngredient(id: ID, updates: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'supplier'>>): Promise<Ingredient> {
    // Check if ingredient exists
    const existing = await this.ingredientsRepo.findById(id);
    if (!existing) {
      throw new Error(`Ingredient with id ${id} not found`);
    }

    // If updating supplier, validate it exists
    if (updates.supplierID) {
      const supplier = await this.suppliersRepo.findById(updates.supplierID);
      if (!supplier) {
        throw new Error(`Supplier with id ${updates.supplierID} not found`);
      }
    }

    return this.ingredientsRepo.update(id, updates);
  }

  async deleteIngredient(id: ID): Promise<void> {
    const deleted = await this.ingredientsRepo.delete(id);
    if (!deleted) {
      throw new Error(`Ingredient with id ${id} not found`);
    }
  }

  async getSuppliers(): Promise<Array<{ id: ID; name: string }>> {
    const suppliers = await this.suppliersRepo.findAll();
    return suppliers.map(s => ({ id: s.id, name: s.name }));
  }
}

export class SuppliersService {
  constructor(private suppliersRepo: SuppliersRepository) {}

  async getSuppliers(): Promise<Supplier[]> {
    return this.suppliersRepo.findAll();
  }

  async getSupplierById(id: ID): Promise<Supplier> {
    const supplier = await this.suppliersRepo.findById(id);
    if (!supplier) {
      throw new Error(`Supplier with id ${id} not found`);
    }
    return supplier;
  }

  async createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    return this.suppliersRepo.create(data);
  }
}
