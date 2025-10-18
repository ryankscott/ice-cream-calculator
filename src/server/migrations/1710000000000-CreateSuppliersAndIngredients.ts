import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSuppliersAndIngredients1710000000000
	implements MigrationInterface
{
	name = "CreateSuppliersAndIngredients1710000000000";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT,
        "phone" TEXT,
        "address" TEXT,
        "website" TEXT,
        "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
        "last_modified_at" TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

		await queryRunner.query(`
      CREATE TABLE "ingredients" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "name" TEXT NOT NULL,
        "supplier_id" TEXT NOT NULL,
        "status" TEXT NOT NULL CHECK ("status" IN ('Active','Inactive')),
        "category" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "brand" TEXT,
        "food_composition_id" TEXT,
        "energy_per_100g" REAL,
        "protein_per_100g" REAL,
        "total_fat_per_100g" REAL,
        "saturated_fat_per_100g" REAL,
        "total_carb_per_100g" REAL,
        "total_sugars_per_100g" REAL,
        "sodium_mg_per_100g" REAL,
        "water_per_100g" REAL,
        "total_solids_per_100g" REAL,
        "other_solids_per_100g" REAL,
        "msnf_per_100g" REAL,
        "sucrose_per_100g" REAL,
        "fructose_per_100g" REAL,
        "glucose_per_100g" REAL,
        "dextrose_per_100g" REAL,
        "alcohol_per_100g" REAL,
        "other_sugars_per_100g" REAL,
        "pac" REAL,
        "pod" REAL,
        "hf" REAL,
        "dry_cocoa_solids_per_100g" REAL,
        "cocoa_butter_per_100g" REAL,
        "supplier_code" TEXT,
        "package_size_in_grams" REAL,
        "cost_per_pack_in_cents_ex_gst" INTEGER,
        "cost_per_1000g_in_cents_ex_gst" INTEGER,
        "percent_of_useful_product" REAL,
        "allergens" TEXT NOT NULL DEFAULT '{}',
        "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
        "last_modified_at" TEXT NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_ingredients_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

		await queryRunner.query(`
      CREATE INDEX "idx_ingredients_supplier_id" ON "ingredients" ("supplier_id")
    `);
		await queryRunner.query(`
      CREATE INDEX "idx_ingredients_category" ON "ingredients" ("category")
    `);
		await queryRunner.query(`
      CREATE INDEX "idx_ingredients_status" ON "ingredients" ("status")
    `);
		await queryRunner.query(`
      CREATE INDEX "idx_ingredients_name" ON "ingredients" ("name")
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX IF EXISTS "idx_ingredients_name"`);
		await queryRunner.query(`DROP INDEX IF EXISTS "idx_ingredients_status"`);
		await queryRunner.query(`DROP INDEX IF EXISTS "idx_ingredients_category"`);
		await queryRunner.query(
			`DROP INDEX IF EXISTS "idx_ingredients_supplier_id"`,
		);
		await queryRunner.query(`DROP TABLE IF EXISTS "ingredients"`);
		await queryRunner.query(`DROP TABLE IF EXISTS "suppliers"`);
	}
}
