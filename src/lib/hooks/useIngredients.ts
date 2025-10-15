import { useQuery } from '@tanstack/react-query'

import {
  fetchIngredients,
  type IngredientListParams,
} from '../api/ingredients'

export function useIngredients(params: IngredientListParams = {}) {
  return useQuery({
    queryKey: ['ingredients', params],
    queryFn: () => fetchIngredients(params),
    keepPreviousData: true,
  })
}

