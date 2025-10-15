import type { components } from '@/server/generated/openapi-types'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export type Ingredient = components['schemas']['Ingredient']
export type IngredientListResponse =
  components['schemas']['IngredientListResponse']

export interface IngredientListParams {
  status?: 'Active' | 'Inactive'
  category?: string
  supplierId?: string
  page?: number
  pageSize?: number
}

export async function fetchIngredients(
  params: IngredientListParams = {},
): Promise<IngredientListResponse> {
  const url = new URL(`${API_BASE}/ingredients`, window.location.origin)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    url.searchParams.set(key, String(value))
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => undefined)
    throw new Error(body?.message ?? 'Failed to load ingredients')
  }

  const data = (await response.json()) as IngredientListResponse
  return data
}

