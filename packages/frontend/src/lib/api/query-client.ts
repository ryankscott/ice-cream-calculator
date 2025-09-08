import { QueryClient } from '@tanstack/react-query';

// Create a client with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data stays fresh before refetch
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // How long to keep data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes
      
      // Retry failed requests
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (useful for keeping data fresh)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

// Query keys factory for consistent cache management
export const queryKeys = {
  // Ingredients
  ingredients: {
    all: ['ingredients'] as const,
    lists: () => [...queryKeys.ingredients.all, 'list'] as const,
    list: (params: any) => [...queryKeys.ingredients.lists(), params] as const,
    details: () => [...queryKeys.ingredients.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.ingredients.details(), id] as const,
  },
  
  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    list: () => [...queryKeys.suppliers.lists()] as const,
    details: () => [...queryKeys.suppliers.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.suppliers.details(), id] as const,
  },
  
  // Health
  health: {
    check: ['health', 'check'] as const,
  },
} as const;
