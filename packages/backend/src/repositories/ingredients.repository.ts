import type { DatabaseInterface } from '../database/connection';
import type { Ingredient, Supplier, ID } from '@ice-cream-calculator/shared';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  type?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SuppliersRepository {
  constructor(private db: DatabaseInterface) {}

  async findAll(): Promise<Supplier[]> {
    const rows = await this.db.all(`
      SELECT * FROM suppliers 
      ORDER BY name
    `);

    return rows.map(this.mapRowToSupplier);
  }

  async findById(id: ID): Promise<Supplier | null> {
    const row = await this.db.get(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );

    return row ? this.mapRowToSupplier(row) : null;
  }

  async create(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    const id = `sup-${Date.now()}`;
    
    await this.db.run(`
      INSERT INTO suppliers (
        id, name, email, phone, address, website
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      id,
      supplier.name,
      supplier.contactInfo.email || null,
      supplier.contactInfo.phone || null,
      supplier.contactInfo.address || null,
      supplier.website || null
    ]);

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create supplier');
    }
    return created;
  }

  private mapRowToSupplier(row: any): Supplier {
    return {
      id: row.id,
      name: row.name,
      contactInfo: {
        email: row.email || '',
        phone: row.phone || '',
        address: row.address || ''
      },
      website: row.website || ''
    };
  }
}

export class IngredientsRepository {
  constructor(private db: DatabaseInterface, private suppliersRepo: SuppliersRepository) {}

  async findAllWithPagination(
    pagination: PaginationParams,
    filters: FilterParams = {}
  ): Promise<PaginatedResult<Ingredient>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters.search) {
      conditions.push('(i.name LIKE ? OR i.brand LIKE ? OR s.name LIKE ?)');
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters.category) {
      conditions.push('i.category = ?');
      params.push(filters.category);
    }

    if (filters.status) {
      conditions.push('i.status = ?');
      params.push(filters.status);
    }

    if (filters.type) {
      conditions.push('i.type = ?');
      params.push(filters.type);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ingredients i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ${whereClause}
    `;
    const countResult = await this.db.get(countQuery, params);
    const total = countResult?.total;

    // Get paginated results
    const dataQuery = `
      SELECT 
        i.*,
        s.name as supplier_name,
        s.email as supplier_email,
        s.phone as supplier_phone,
        s.address as supplier_address,
        s.website as supplier_website
      FROM ingredients i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ${whereClause}
      ORDER BY i.name
      LIMIT ? OFFSET ?
    `;
    const rows = await this.db.all(dataQuery, [...params, limit, offset]);

    const data = rows.map(this.mapRowToIngredient);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findById(id: ID): Promise<Ingredient | null> {
    const row = await this.db.get(`
      SELECT 
        i.*,
        s.name as supplier_name,
        s.email as supplier_email,
        s.phone as supplier_phone,
        s.address as supplier_address,
        s.website as supplier_website
      FROM ingredients i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      WHERE i.id = ?
    `, [id]);

    return row ? this.mapRowToIngredient(row) : null;
  }

  async create(ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'lastModifiedAt'>): Promise<Ingredient> {
    const id = `ing-${Date.now()}`;
    const now = new Date().toISOString();

    await this.db.run(`
      INSERT INTO ingredients (
        id, name, supplier_id, status, category, type, brand, food_composition_id,
        energy_per_100g, protein_per_100g, total_fat_per_100g, saturated_fat_per_100g,
        total_carb_per_100g, total_sugars_per_100g, sodium_mg_per_100g, water_per_100g,
        total_solids_per_100g, other_solids_per_100g, msnf_per_100g,
        sucrose_per_100g, fructose_per_100g, glucose_per_100g, dextrose_per_100g,
        alcohol_per_100g, other_sugars_per_100g,
        pac, pod, hf, dry_cocoa_solids_per_100g, cocoa_butter_per_100g,
        supplier_code, package_size_in_grams, cost_per_pack_in_cents_ex_gst,
        cost_per_1000g_in_cents_ex_gst, percent_of_useful_product,
        allergens, created_at, last_modified_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      id, ingredient.name, ingredient.supplierID, ingredient.status,
      ingredient.category, ingredient.type, ingredient.brand, ingredient.foodCompositionID,
      ingredient.energyPer100g, ingredient.proteinPer100g, ingredient.totalFatPer100g,
      ingredient.saturatedFatPer100g, ingredient.totalCarbPer100g, ingredient.totalSugarsPer100g,
      ingredient.sodiumMgPer100g, ingredient.waterPer100g, ingredient.totalSolidsPer100g,
      ingredient.otherSolidsPer100g, ingredient.MSNFPer100g,
      ingredient.sugarsPer100g.sucrose, ingredient.sugarsPer100g.fructose,
      ingredient.sugarsPer100g.glucose, ingredient.sugarsPer100g.dextrose,
      ingredient.sugarsPer100g.alcohol, ingredient.sugarsPer100g.other,
      ingredient.PAC, ingredient.POD, ingredient.HF, ingredient.dryCocoaSolidsPer100g,
      ingredient.cocoaButterPer100g, ingredient.supplierCode, ingredient.packageSizeInGrams,
      ingredient.costPerPackInCentsExGST, ingredient.costPer1000gInCentsExGST,
      ingredient.percentOfUsefulProduct, JSON.stringify(ingredient.allergens), now, now
    ]);

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create ingredient');
    }
    return created;
  }

  async update(id: ID, updates: Partial<Omit<Ingredient, 'id' | 'createdAt'>>): Promise<Ingredient> {
    const now = new Date().toISOString();
    
    // Build dynamic update query
    const updateFields: string[] = [];
    const params: any[] = [];

    const fieldMappings: { [key: string]: string } = {
      name: 'name',
      supplierID: 'supplier_id',
      status: 'status',
      category: 'category',
      type: 'type',
      brand: 'brand',
      foodCompositionID: 'food_composition_id',
      energyPer100g: 'energy_per_100g',
      proteinPer100g: 'protein_per_100g',
      totalFatPer100g: 'total_fat_per_100g',
      saturatedFatPer100g: 'saturated_fat_per_100g',
      totalCarbPer100g: 'total_carb_per_100g',
      totalSugarsPer100g: 'total_sugars_per_100g',
      sodiumMgPer100g: 'sodium_mg_per_100g',
      waterPer100g: 'water_per_100g',
      totalSolidsPer100g: 'total_solids_per_100g',
      otherSolidsPer100g: 'other_solids_per_100g',
      MSNFPer100g: 'msnf_per_100g',
      PAC: 'pac',
      POD: 'pod',
      HF: 'hf',
      dryCocoaSolidsPer100g: 'dry_cocoa_solids_per_100g',
      cocoaButterPer100g: 'cocoa_butter_per_100g',
      supplierCode: 'supplier_code',
      packageSizeInGrams: 'package_size_in_grams',
      costPerPackInCentsExGST: 'cost_per_pack_in_cents_ex_gst',
      costPer1000gInCentsExGST: 'cost_per_1000g_in_cents_ex_gst',
      percentOfUsefulProduct: 'percent_of_useful_product'
    };

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'sugarsPer100g' && value) {
        const sugars = value as any;
        updateFields.push('sucrose_per_100g = ?', 'fructose_per_100g = ?', 'glucose_per_100g = ?', 
                         'dextrose_per_100g = ?', 'alcohol_per_100g = ?', 'other_sugars_per_100g = ?');
        params.push(sugars.sucrose, sugars.fructose, sugars.glucose, sugars.dextrose, sugars.alcohol, sugars.other);
      } else if (key === 'allergens' && value) {
        updateFields.push('allergens = ?');
        params.push(JSON.stringify(value));
      } else if (fieldMappings[key] && value !== undefined) {
        updateFields.push(`${fieldMappings[key]} = ?`);
        params.push(value);
      }
    }

    if (updateFields.length === 0) {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Ingredient not found');
      }
      return existing;
    }

    updateFields.push('last_modified_at = ?');
    params.push(now, id);

    await this.db.run(`
      UPDATE ingredients 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, params);

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Ingredient not found after update');
    }
    return updated;
  }

  async delete(id: ID): Promise<boolean> {
    const result = await this.db.run('DELETE FROM ingredients WHERE id = ?', [id]);
    return result.changes > 0;
  }

  private mapRowToIngredient(row: any): Ingredient {
    const allergens = row.allergens ? JSON.parse(row.allergens) : {};
    
    return {
      id: row.id,
      name: row.name,
      supplierID: row.supplier_id,
      status: row.status,
      category: row.category,
      type: row.type,
      brand: row.brand || '',
      foodCompositionID: row.food_composition_id || '',
      energyPer100g: row.energy_per_100g || 0,
      proteinPer100g: row.protein_per_100g || 0,
      totalFatPer100g: row.total_fat_per_100g || 0,
      saturatedFatPer100g: row.saturated_fat_per_100g || 0,
      totalCarbPer100g: row.total_carb_per_100g || 0,
      totalSugarsPer100g: row.total_sugars_per_100g || 0,
      sodiumMgPer100g: row.sodium_mg_per_100g || 0,
      waterPer100g: row.water_per_100g || 0,
      sugarsPer100g: {
        sucrose: row.sucrose_per_100g || 0,
        fructose: row.fructose_per_100g || 0,
        glucose: row.glucose_per_100g || 0,
        dextrose: row.dextrose_per_100g || 0,
        alcohol: row.alcohol_per_100g || 0,
        other: row.other_sugars_per_100g || 0
      },
      totalSolidsPer100g: row.total_solids_per_100g || 0,
      otherSolidsPer100g: row.other_solids_per_100g || 0,
      MSNFPer100g: row.msnf_per_100g || 0,
      PAC: row.pac || 0,
      POD: row.pod || 0,
      HF: row.hf || 0,
      dryCocoaSolidsPer100g: row.dry_cocoa_solids_per_100g || 0,
      cocoaButterPer100g: row.cocoa_butter_per_100g || 0,
      supplier: {
        id: row.supplier_id,
        name: row.supplier_name || '',
        contactInfo: {
          email: row.supplier_email || '',
          phone: row.supplier_phone || '',
          address: row.supplier_address || ''
        },
        website: row.supplier_website || ''
      },
      supplierCode: row.supplier_code || '',
      packageSizeInGrams: row.package_size_in_grams || 0,
      costPerPackInCentsExGST: row.cost_per_pack_in_cents_ex_gst || 0,
      costPer1000gInCentsExGST: row.cost_per_1000g_in_cents_ex_gst || 0,
      percentOfUsefulProduct: row.percent_of_useful_product || 100,
      allergens,
      createdAt: row.created_at,
      lastModifiedAt: row.last_modified_at
    };
  }
}
