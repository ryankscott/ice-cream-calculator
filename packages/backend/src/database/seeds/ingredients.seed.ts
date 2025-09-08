import { DatabaseInterface } from '../connection';
import logger from '../../utils/logger';
import { sampleIngredients } from './sample-data';

export async function seedDatabase(db: DatabaseInterface): Promise<void> {
  logger.info('Starting database seeding...');

  try {
    // Check if suppliers already exist
    const existingSuppliers = await db.all('SELECT COUNT(*) as count FROM suppliers');
    const supplierCount = existingSuppliers?.[0]?.count || 0;
    if (supplierCount > 0) {
      logger.info('Database already has suppliers, skipping seed');
      return;
    }

    // Extract unique suppliers from ingredients
    const suppliersMap = new Map();
    
    for (const ingredient of sampleIngredients) {
      if (!suppliersMap.has(ingredient.supplier.id)) {
        suppliersMap.set(ingredient.supplier.id, ingredient.supplier);
      }
    }

    // Insert suppliers
    logger.info(`Seeding ${suppliersMap.size} suppliers...`);
    for (const supplier of suppliersMap.values()) {
      await db.run(`
        INSERT INTO suppliers (
          id, name, email, phone, address, website
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        supplier.id,
        supplier.name,
        supplier.contactInfo.email || null,
        supplier.contactInfo.phone || null,
        supplier.contactInfo.address || null,
        supplier.website || null
      ]);
    }

    // Insert ingredients
    logger.info(`Seeding ${sampleIngredients.length} ingredients...`);
    for (const ingredient of sampleIngredients) {
      await db.run(`
        INSERT INTO ingredients (
          id, name, supplier_id, status, category, type, brand, food_composition_id,
          energy_per_100g, protein_per_100g, total_fat_per_100g, saturated_fat_per_100g,
          total_carb_per_100g, total_sugars_per_100g, sodium_mg_per_100g, water_per_100g,
          total_solids_per_100g, other_solids_per_100g, msnf_per_100g,
          sucrose_per_100g, fructose_per_100g, glucose_per_100g, dextrose_per_100g,
          alcohol_sugars_per_100g, other_sugars_per_100g,
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
        ingredient.id,
        ingredient.name,
        ingredient.supplierID,
        ingredient.status,
        ingredient.category,
        ingredient.type,
        ingredient.brand,
        ingredient.foodCompositionID,
        ingredient.energyPer100g,
        ingredient.proteinPer100g,
        ingredient.totalFatPer100g,
        ingredient.saturatedFatPer100g,
        ingredient.totalCarbPer100g,
        ingredient.totalSugarsPer100g,
        ingredient.sodiumMgPer100g,
        ingredient.waterPer100g,
        ingredient.totalSolidsPer100g,
        ingredient.otherSolidsPer100g,
        ingredient.MSNFPer100g,
        ingredient.sugarsPer100g.sucrose,
        ingredient.sugarsPer100g.fructose,
        ingredient.sugarsPer100g.glucose,
        ingredient.sugarsPer100g.dextrose,
        ingredient.sugarsPer100g.alcohol,
        ingredient.sugarsPer100g.other,
        ingredient.PAC,
        ingredient.POD,
        ingredient.HF,
        ingredient.dryCocoaSolidsPer100g,
        ingredient.cocoaButterPer100g,
        ingredient.supplierCode,
        ingredient.packageSizeInGrams,
        ingredient.costPerPackInCentsExGST,
        ingredient.costPer1000gInCentsExGST,
        ingredient.percentOfUsefulProduct,
        JSON.stringify(ingredient.allergens),
        ingredient.createdAt,
        ingredient.lastModifiedAt
      ]);
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Error seeding database');
    throw error;
  }
}
