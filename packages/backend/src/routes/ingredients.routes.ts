import { Router, Request, Response } from 'express';
import { z } from 'zod';
import type { IngredientsService } from '../services/ingredients.service';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  getIngredientsSchema, 
  createIngredientSchema, 
  updateIngredientSchema,
  type GetIngredientsResponse,
  type CreateIngredientResponse,
  type GetSuppliersResponse,
  type GetIngredientResponse,
  type UpdateIngredientResponse,
  type DeleteIngredientResponse
} from '@ice-cream-calculator/shared';

export function createIngredientsRoutes(ingredientsService: IngredientsService): Router {
  const router = Router();

  // GET /api/ingredients - List ingredients with pagination and filtering
  router.get('/', 
    validateRequest(z.object({
      query: getIngredientsSchema
    })),
    async (req: Request, res: Response) => {
      try {
        const result = await ingredientsService.getIngredients(req.query as any);
        
        const response: GetIngredientsResponse = {
          success: true,
          data: result.data
        };

        res.json(response);
      } catch (error) {
        throw error;
      }
    }
  );

  // GET /api/ingredients/:id - Get single ingredient
  router.get('/:id',
    validateRequest(z.object({
      params: z.object({
        id: z.string().min(1)
      })
    })),
    async (req: Request, res: Response) => {
      try {
        const ingredient = await ingredientsService.getIngredientById(req.params.id);
        
        const response: GetIngredientResponse = {
          success: true,
          data: ingredient
        };

        res.json(response);
      } catch (error) {
        throw error;
      }
    }
  );

  // POST /api/ingredients - Create new ingredient
  router.post('/',
    validateRequest(z.object({
      body: createIngredientSchema
    })),
    async (req: Request, res: Response) => {
      try {
        const ingredient = await ingredientsService.createIngredient(req.body.ingredient);
        
        const response: CreateIngredientResponse = {
          success: true,
          data: ingredient
        };

        res.status(201).json(response);
      } catch (error) {
        throw error;
      }
    }
  );

  // PUT /api/ingredients/:id - Update existing ingredient
  router.put('/:id',
    validateRequest(z.object({
      params: z.object({
        id: z.string().min(1)
      }),
      body: updateIngredientSchema
    })),
    async (req: Request, res: Response) => {
      try {
        const ingredient = await ingredientsService.updateIngredient(
          req.params.id, 
          req.body.ingredient
        );
        
        const response: UpdateIngredientResponse = {
          success: true,
          data: ingredient
        };

        res.json(response);
      } catch (error) {
        throw error;
      }
    }
  );

  // DELETE /api/ingredients/:id - Delete ingredient
  router.delete('/:id',
    validateRequest(z.object({
      params: z.object({
        id: z.string().min(1)
      })
    })),
    async (req: Request, res: Response) => {
      try {
        await ingredientsService.deleteIngredient(req.params.id);
        
        const response: DeleteIngredientResponse = {
          success: true,
          message: 'Ingredient deleted successfully'
        };

        res.json(response);
      } catch (error) {
        throw error;
      }
    }
  );

  return router;
}

export function createSuppliersRoutes(ingredientsService: IngredientsService): Router {
  const router = Router();

  // GET /api/suppliers - List suppliers for dropdowns
  router.get('/', async (req: Request, res: Response) => {
    try {
      const suppliers = await ingredientsService.getSuppliers();
      
      const response: GetSuppliersResponse = {
        success: true,
        data: suppliers
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  });

  return router;
}
