import { 
  useQuery,
  type UseQueryOptions 
} from '@tanstack/react-query';

import { suppliersAPI, APIError } from '../api/client';
import { queryKeys } from '../api/query-client';
import type { Supplier, ID } from '@ice-cream-calculator/shared';

// Hook to fetch all suppliers
export function useSuppliers(
  options?: UseQueryOptions<{ success: boolean; data: Supplier[] }, APIError>
) {
  return useQuery({
    queryKey: queryKeys.suppliers.list(),
    queryFn: () => suppliersAPI.getSuppliers(),
    ...options,
  });
}

// Hook to fetch a single supplier by ID
export function useSupplier(
  id: ID,
  options?: UseQueryOptions<{ success: boolean; data: Supplier }, APIError>
) {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => suppliersAPI.getSupplier(id),
    enabled: !!id, // Only run if ID is provided
    ...options,
  });
}
