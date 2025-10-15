import 'reflect-metadata'

import { createRequire } from 'node:module'

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { DataSource } from 'typeorm'

import { Ingredient } from '../entities/Ingredient'
import { Supplier } from '../entities/Supplier'
import { SupplierService } from './supplier-service'

const requireModule = createRequire(import.meta.url)

let sqlite3Available = true
try {
  requireModule('sqlite3')
} catch (error) {
  sqlite3Available = false
  console.warn(
    'Skipping SupplierService tests because sqlite3 native bindings are unavailable.',
    error,
  )
}

const describeIf = sqlite3Available ? describe : describe.skip

describeIf('SupplierService', () => {
  let dataSource: DataSource
  let supplierService: SupplierService

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [Supplier, Ingredient],
      synchronize: true,
      logging: false,
    })
    await dataSource.initialize()
    supplierService = new SupplierService(dataSource)
  })

  afterEach(async () => {
    if (!dataSource.isInitialized) return
    await dataSource.getRepository(Ingredient).delete({})
    await dataSource.getRepository(Supplier).delete({})
  })

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy()
    }
  })

  it('creates suppliers with generated id when omitted', async () => {
    const supplier = await supplierService.create({
      name: 'Generated Supplier',
    })

    expect(supplier.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  })

  it('enforces uniqueness before deletion', async () => {
    const supplier = await supplierService.create({
      name: 'Deletable Supplier',
    })

    await supplierService.delete(supplier.id)

    const list = await supplierService.list({ page: 1, pageSize: 10 })
    expect(list.meta.totalItems).toBe(0)
  })

  it('blocks deletion when ingredients reference the supplier', async () => {
    const supplier = await supplierService.create({
      name: 'Linked Supplier',
    })

    await dataSource.getRepository(Ingredient).save({
      id: 'linked-ingredient',
      name: 'Linked Ingredient',
      supplier,
      status: 'Active',
      category: 'Test',
      type: 'Powder',
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      allergens: {},
    })

    await expect(supplierService.delete(supplier.id)).rejects.toMatchObject({
      name: 'ValidationError',
      status: 400,
    })
  })
})
