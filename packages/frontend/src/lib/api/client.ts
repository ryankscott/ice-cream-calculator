import type {
  GetIngredientsInput,
  GetIngredientsResponse,
  CreateIngredientRequest,
  CreateIngredientResponse,
  UpdateIngredientRequest,
  Ingredient,
  Supplier,
  ID
} from '@ice-cream-calculator/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error occurred' };
      }
      
      throw new APIError(
        errorData.error?.message || `HTTP ${response.status}`,
        response.status,
        errorData.error?.code,
        errorData.error?.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Ingredients API
export const ingredientsAPI = {
  // Get ingredients with pagination and filtering
  async getIngredients(params: GetIngredientsInput): Promise<GetIngredientsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.set('page', params.page.toString());
    if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);
    if (params.status) searchParams.set('status', params.status);
    if (params.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    const endpoint = `/ingredients${query ? `?${query}` : ''}`;
    
    return apiRequest<GetIngredientsResponse>(endpoint);
  },

  // Get single ingredient by ID
  async getIngredient(id: ID): Promise<{ success: boolean; data: Ingredient }> {
    return apiRequest<{ success: boolean; data: Ingredient }>(`/ingredients/${id}`);
  },

  // Create new ingredient
  async createIngredient(data: CreateIngredientRequest): Promise<CreateIngredientResponse> {
    return apiRequest<CreateIngredientResponse>('/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update existing ingredient
  async updateIngredient(
    id: ID,
    data: UpdateIngredientRequest
  ): Promise<{ success: boolean; data: Ingredient }> {
    return apiRequest<{ success: boolean; data: Ingredient }>(`/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete ingredient
  async deleteIngredient(id: ID): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/ingredients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Suppliers API
export const suppliersAPI = {
  // Get all suppliers
  async getSuppliers(): Promise<{ success: boolean; data: Supplier[] }> {
    return apiRequest<{ success: boolean; data: Supplier[] }>('/suppliers');
  },

  // Get single supplier by ID
  async getSupplier(id: ID): Promise<{ success: boolean; data: Supplier }> {
    return apiRequest<{ success: boolean; data: Supplier }>(`/suppliers/${id}`);
  },
};

// Health check
export const healthAPI = {
  async check(): Promise<{ status: string; timestamp: string; version: string }> {
    return apiRequest<{ status: string; timestamp: string; version: string }>('/health');
  },
};

// Export error class for use in components
export { APIError };
