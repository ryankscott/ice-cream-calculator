import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm'

import { Supplier } from './Supplier'

export type IngredientStatus = 'Active' | 'Inactive'

@Check("status IN ('Active','Inactive')")
@Index('idx_ingredients_supplier_id', ['supplier'])
@Index('idx_ingredients_category', ['category'])
@Index('idx_ingredients_status', ['status'])
@Index('idx_ingredients_name', ['name'])
@Entity({ name: 'ingredients' })
export class Ingredient {
  @PrimaryColumn('text')
  id!: string

  @Column({ type: 'text' })
  name!: string

  @ManyToOne(() => Supplier, (supplier) => supplier.ingredients, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier

  @RelationId((ingredient: Ingredient) => ingredient.supplier)
  supplierId!: string

  @Column({ type: 'text' })
  status!: IngredientStatus

  @Column({ type: 'text' })
  category!: string

  @Column({ type: 'text' })
  type!: string

  @Column({ type: 'text', nullable: true })
  brand!: string | null

  @Column({ type: 'text', name: 'food_composition_id', nullable: true })
  foodCompositionId!: string | null

  @Column({ type: 'real', name: 'energy_per_100g', nullable: true })
  energyPer100g!: number | null

  @Column({ type: 'real', name: 'protein_per_100g', nullable: true })
  proteinPer100g!: number | null

  @Column({ type: 'real', name: 'total_fat_per_100g', nullable: true })
  totalFatPer100g!: number | null

  @Column({ type: 'real', name: 'saturated_fat_per_100g', nullable: true })
  saturatedFatPer100g!: number | null

  @Column({ type: 'real', name: 'total_carb_per_100g', nullable: true })
  totalCarbPer100g!: number | null

  @Column({ type: 'real', name: 'total_sugars_per_100g', nullable: true })
  totalSugarsPer100g!: number | null

  @Column({ type: 'real', name: 'sodium_mg_per_100g', nullable: true })
  sodiumMgPer100g!: number | null

  @Column({ type: 'real', name: 'water_per_100g', nullable: true })
  waterPer100g!: number | null

  @Column({ type: 'real', name: 'total_solids_per_100g', nullable: true })
  totalSolidsPer100g!: number | null

  @Column({ type: 'real', name: 'other_solids_per_100g', nullable: true })
  otherSolidsPer100g!: number | null

  @Column({ type: 'real', name: 'msnf_per_100g', nullable: true })
  msnfPer100g!: number | null

  @Column({ type: 'real', name: 'sucrose_per_100g', nullable: true })
  sucrosePer100g!: number | null

  @Column({ type: 'real', name: 'fructose_per_100g', nullable: true })
  fructosePer100g!: number | null

  @Column({ type: 'real', name: 'glucose_per_100g', nullable: true })
  glucosePer100g!: number | null

  @Column({ type: 'real', name: 'dextrose_per_100g', nullable: true })
  dextrosePer100g!: number | null

  @Column({ type: 'real', name: 'alcohol_per_100g', nullable: true })
  alcoholPer100g!: number | null

  @Column({ type: 'real', name: 'other_sugars_per_100g', nullable: true })
  otherSugarsPer100g!: number | null

  @Column({ type: 'real', nullable: true })
  pac!: number | null

  @Column({ type: 'real', nullable: true })
  pod!: number | null

  @Column({ type: 'real', nullable: true })
  hf!: number | null

  @Column({
    type: 'real',
    name: 'dry_cocoa_solids_per_100g',
    nullable: true,
  })
  dryCocoaSolidsPer100g!: number | null

  @Column({ type: 'real', name: 'cocoa_butter_per_100g', nullable: true })
  cocoaButterPer100g!: number | null

  @Column({ type: 'text', name: 'supplier_code', nullable: true })
  supplierCode!: string | null

  @Column({ type: 'real', name: 'package_size_in_grams', nullable: true })
  packageSizeInGrams!: number | null

  @Column({
    type: 'integer',
    name: 'cost_per_pack_in_cents_ex_gst',
    nullable: true,
  })
  costPerPackInCentsExGst!: number | null

  @Column({
    type: 'integer',
    name: 'cost_per_1000g_in_cents_ex_gst',
    nullable: true,
  })
  costPer1000gInCentsExGst!: number | null

  @Column({
    type: 'real',
    name: 'percent_of_useful_product',
    nullable: true,
  })
  percentOfUsefulProduct!: number | null

  @Column({
    type: 'simple-json',
    default: () => "'{}'",
  })
  allergens!: Record<string, unknown>

  @Column({
    type: 'text',
    name: 'created_at',
    default: () => "datetime('now')",
  })
  createdAt!: string

  @Column({
    type: 'text',
    name: 'last_modified_at',
    default: () => "datetime('now')",
  })
  lastModifiedAt!: string
}
