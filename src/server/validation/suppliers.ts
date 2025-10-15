import { randomUUID } from 'node:crypto'

import { z } from 'zod'

import { schemas } from '../generated/zod-schemas'

export const SupplierCreateSchema = schemas.SupplierCreateInput.extend({
  id: z.string().uuid().default(() => randomUUID()),
})

export type SupplierCreateInput = z.infer<typeof SupplierCreateSchema>

export const SupplierUpdateSchema = schemas.SupplierUpdateInput
export type SupplierUpdateInput = z.infer<typeof SupplierUpdateSchema>

export const SupplierIdSchema = schemas.SupplierId.uuid()

export const SupplierListQuerySchema = z
  .object({
    page: z
      .union([z.number(), z.string()])
      .transform((value) => Number(value))
      .pipe(z.number().int().min(1))
      .default(1),
    pageSize: z
      .union([z.number(), z.string()])
      .transform((value) => Number(value))
      .pipe(z.number().int().min(1).max(200))
      .default(25),
  })
  .strict()

export type SupplierListQuery = z.infer<typeof SupplierListQuerySchema>

export function validateSupplierCreate(input: unknown): SupplierCreateInput {
  return SupplierCreateSchema.parse(input)
}

export function validateSupplierUpdate(input: unknown): SupplierUpdateInput {
  return SupplierUpdateSchema.parse(input)
}

export function validateSupplierListQuery(input: unknown): SupplierListQuery {
  return SupplierListQuerySchema.parse(input)
}

