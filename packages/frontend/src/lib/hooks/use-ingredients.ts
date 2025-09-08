import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions 
} from '@tanstack/react-query';

import { ingredientsAPI, APIError } from '../api/client';
import { queryKeys } from '../api/query-client';
import type {
  GetIngredientsInput,
  GetIngredientsResponse,
  CreateIngredientRequest,
  CreateIngredientResponse,
  UpdateIngredientRequest,
  Ingredient,
  ID
} from '@ice-cream-calculator/shared';

// Hook to fetch ingredients list with pagination and filtering
export function useIngredients(
  params: GetIngredientsInput = { page: 1, limit: 10 },
  options?: UseQueryOptions<GetIngredientsResponse, APIError>
) {
  return useQuery({
    queryKey: queryKeys.ingredients.list(params),
    queryFn: () => ingredientsAPI.getIngredients(params),
    ...options,
  });
}

// Hook to fetch a single ingredient by ID
export function useIngredient(
  id: ID,
  options?: UseQueryOptions<{ success: boolean; data: Ingredient }, APIError>
) {
  return useQuery({
    queryKey: queryKeys.ingredients.detail(id),
    queryFn: () => ingredientsAPI.getIngredient(id),
    enabled: !!id, // Only run if ID is provided
    ...options,
  });
}

// Hook to create a new ingredient
export function useCreateIngredient(
  options?: UseMutationOptions<CreateIngredientResponse, APIError, CreateIngredientRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIngredientRequest) => ingredientsAPI.createIngredient(data),
    
    onSuccess: (response: CreateIngredientResponse) => {
      // Invalidate and refetch ingredients list
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.lists(),
      });
      
      // Add the new ingredient to the cache
      queryClient.setQueryData(
        queryKeys.ingredients.detail(response.data.id),
        { success: true, data: response.data }
      );
      
      console.log(`Ingredient "${response.data.name}" created successfully!`);
    },
    
    onError: (error: APIError) => {
      console.error(
        'Failed to create ingredient:',
        error.details?.message || error.message
      );
    },
    
    ...options,
  });
}

// Hook to update an existing ingredient
export function useUpdateIngredient(
  options?: UseMutationOptions<
    { success: boolean; data: Ingredient }, 
    APIError, 
    { id: ID; data: UpdateIngredientRequest }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: ID; data: UpdateIngredientRequest }) => 
      ingredientsAPI.updateIngredient(id, data),
    
    onSuccess: (
      response: { success: boolean; data: Ingredient }, 
      variables: { id: ID; data: UpdateIngredientRequest }
    ) => {
      // Update the specific ingredient in cache
      queryClient.setQueryData(
        queryKeys.ingredients.detail(variables.id),
        response
      );
      
      // Invalidate ingredients list to reflect changes
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.lists(),
      });
      
      console.log(`Ingredient "${response.data.name}" updated successfully!`);
    },
    
    onError: (error: APIError) => {
      console.error(
        'Failed to update ingredient:',
        error.details?.message || error.message
      );
    },
    
    ...options,
  });
}

// Hook to delete an ingredient
export function useDeleteIngredient(
  options?: UseMutationOptions<
    { success: boolean; message: string }, 
    APIError, 
    ID
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: ID) => ingredientsAPI.deleteIngredient(id),
    
    onSuccess: (_response: { success: boolean; message: string }, id: ID) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.ingredients.detail(id),
      });
      
      // Invalidate ingredients list
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredients.lists(),
      });
      
      console.log('Ingredient deleted successfully!');
    },
    
    onError: (error: APIError) => {
      console.error(
        'Failed to delete ingredient:',
        error.details?.message || error.message
      );
    },
    
    ...options,
  });
}

// Hook for optimistic updates when editing ingredients
export function useOptimisticIngredientUpdate() {
  const queryClient = useQueryClient();

  const updateOptimistically = (id: ID, updates: Partial<Ingredient>) => {
    // Update the ingredient detail cache optimistically
    queryClient.setQueryData(
      queryKeys.ingredients.detail(id),
      (old: { success: boolean; data: Ingredient } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, ...updates }
        };
      }
    );

    // Update any ingredients list that contains this ingredient
    queryClient.setQueriesData(
      { queryKey: queryKeys.ingredients.lists() },
      (old: GetIngredientsResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.ingredients.map(ingredient => 
            ingredient.id === id 
              ? { ...ingredient, ...updates }
              : ingredient
          )
        };
      }
    );
  };

  const revertOptimisticUpdate = (id: ID) => {
    // Invalidate to refetch real data
    queryClient.invalidateQueries({
      queryKey: queryKeys.ingredients.detail(id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.ingredients.lists(),
    });
  };

  return { updateOptimistically, revertOptimisticUpdate };
}
