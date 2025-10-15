import 'reflect-metadata'

import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { DataSource } from 'typeorm'

import { Ingredient } from './Ingredient'
import { Supplier } from './Supplier'

const requireModule = createRequire(import.meta.url)

let sqlite3Available = true
try {
  requireModule('sqlite3')
} catch (error) {
  sqlite3Available = false
  console.warn(
    'Skipping Ingredient entity mapping tests because sqlite3 native bindings are unavailable.',
    error,
  )
}

const describeIf = sqlite3Available ? describe : describe.skip

describeIf('Ingredient entity mappings', () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [Supplier, Ingredient],
      synchronize: true,
      logging: false,
    })

    await dataSource.initialize()
  })

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy()
    }
  })

  it('persists allergens JSON and timestamps', async () => {
    const supplierRepo = dataSource.getRepository(Supplier)
    const ingredientRepo = dataSource.getRepository(Ingredient)

    const supplier = supplierRepo.create({
      id: randomUUID(),
      name: 'Gelato Supply Co.',
      email: 'info@gelatosupply.example',
      phone: '+1-555-0100',
      address: '1 Gelato Way',
      website: 'https://gelatosupply.example',
    })
    await supplierRepo.save(supplier)

    const ingredient = ingredientRepo.create({
      id: randomUUID(),
      name: 'Organic Milk Powder',
      supplier,
      status: 'Active',
      category: 'Dairy',
      type: 'Powder',
      brand: 'Gelato Best',
      allergens: {
        milk: true,
        nuts: false,
      },
    })

    await ingredientRepo.save(ingredient)

    const stored = await ingredientRepo.findOneOrFail({
      where: { id: ingredient.id },
      relations: ['supplier'],
    })

    expect(stored.allergens).toEqual({ milk: true, nuts: false })
    expect(stored.createdAt).toBeTruthy()
    expect(stored.lastModifiedAt).toBeTruthy()
    expect(stored.supplierId).toBe(supplier.id)
  })
})
