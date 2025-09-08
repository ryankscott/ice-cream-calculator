# Implementation Plan: Full CRUD for Ice Cream Calculator Ingredients

## Overview

This plan outlines the implementation of a complete CRUD (Create, Read, Update, Delete) system for ingredients in the ice cream calculator application. The solution will include:

- **Backend**: Express.js API with SQLite database and OpenAPI specification
- **Frontend**: Enhanced ingredient dialog with editing capabilities and destructive action confirmations
- **Shared Types**: TypeScript types used across both frontend and backend
- **Logging**: Pino logger integration for proper observability
- **Database**: SQLite3 with proper schema and migrations
- **API Documentation**: OpenAPI 3.0 specification with Swagger UI

## Requirements

### Functional Requirements

1. **Create**: Add new ingredients through the frontend interface
2. **Read**: Display ingredients in table and detailed dialog views (already implemented)
3. **Update**: Edit existing ingredients through enhanced dialog interface
4. **Delete**: Remove ingredients with confirmation dialogs
5. **Validation**: Proper data validation on both frontend and backend
6. **Error Handling**: Comprehensive error handling with user-friendly messages
7. **Logging**: Structured logging for all operations using Pino
8. **API Documentation**: Interactive OpenAPI documentation

### Non-Functional Requirements

1. **Performance**: Efficient database queries and pagination
2. **Security**: Input validation and sanitization
3. **Reliability**: Proper error handling and transaction management
4. **Maintainability**: Shared types and clean architecture
5. **Usability**: Intuitive UI with confirmation dialogs for destructive actions

## Implementation Steps

### Phase 1: Project Structure and Shared Types

1. **Create shared package structure**
├── shared/
│   ├── src/
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   ├── ingredient.ts (moved from frontend)
│   │   │   ├── supplier.ts (moved from frontend)
│   │   │   ├── common.ts (moved from frontend)
│   │   │   ├── allergens.ts (moved from frontend)
│   │   │   └── nutrition.ts (moved from frontend)
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── backend/
└── frontend/ (existing src/ moved here)


2. **Define API types in shared package**
- Request/response DTOs
- Error response types
- Pagination types
- Validation schemas using Zod

3. **Update package.json for monorepo structure**
- Configure workspaces
- Add shared dependencies
- Update build scripts

### Phase 2: Backend API Development

4. **Initialize Express backend**
packages/backend/
├── src/
│   ├── controllers/
│   │   └── ingredients.controller.ts
│   ├── services/
│   │   └── ingredients.service.ts
│   ├── repositories/
│   │   └── ingredients.repository.ts
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 001_create_ingredients.sql
│   │   ├── seeds/
│   │   │   └── ingredients.seed.ts
│   │   └── connection.ts
│   ├── middleware/
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   ├── routes/
│   │   └── ingredients.routes.ts
│   ├── utils/
│   │   └── logger.ts
│   ├── openapi/
│   │   └── spec.yaml
│   └── app.ts
├── package.json
└── tsconfig.json



5. **Database setup**
- SQLite3 database configuration
- Migration system for schema management
- Seed data from existing ingredient data
- Connection pooling and transaction management

6. **Implement CRUD endpoints**
- `GET /api/ingredients` - List ingredients with filtering and pagination
- `GET /api/ingredients/:id` - Get single ingredient
- `POST /api/ingredients` - Create new ingredient
- `PUT /api/ingredients/:id` - Update existing ingredient
- `DELETE /api/ingredients/:id` - Delete ingredient
- `GET /api/suppliers` - List suppliers for dropdowns

7. **Add validation and error handling**
- Zod schemas for request validation
- Custom error classes
- Global error handling middleware
- Proper HTTP status codes

8. **Implement logging with Pino**
- Structured logging configuration
- Request/response logging middleware
- Error logging
- Performance monitoring

9. **OpenAPI specification**
- Complete API documentation
- Schema definitions
- Example requests/responses
- Swagger UI integration

### Phase 3: Frontend Enhancement

10. **Update frontend to use backend API**
 - API client service with proper error handling
 - React Query for data fetching and caching
 - Loading states and error boundaries

11. **Enhanced Ingredient Dialog**
 - Add edit mode toggle
 - Form fields for all ingredient properties
 - Validation on frontend
 - Save/cancel functionality
 - Optimistic updates

12. **Create New Ingredient Feature**
 - "Add Ingredient" button in ingredients table
 - Form dialog for new ingredient creation
 - Supplier selection dropdown
 - Form validation and submission

13. **Delete Confirmation**
 - Confirmation dialog for delete actions
 - Display ingredient name in confirmation
 - Proper error handling for failed deletions
 - Table refresh after deletion

14. **Enhanced Ingredients Table**
 - Delete button in actions column
 - Edit button to open dialog in edit mode
 - Refresh functionality
 - Better loading and error states

### Phase 4: Advanced Features

15. **Batch Operations**
 - Multi-select in ingredients table
 - Bulk delete with confirmation
 - Bulk status updates

16. **Search and Filtering Enhancements**
 - Server-side search implementation
 - Advanced filtering options
 - Saved filter presets

17. **Data Import/Export**
 - CSV import functionality
 - Data validation for imports
 - Export current filtered results
 - Bulk update via CSV

18. **Audit Trail**
 - Track ingredient changes
 - User attribution (when auth is added)
 - Change history viewing

### Phase 5: Testing and Documentation

19. **Backend Testing**
 - Unit tests for services and repositories
 - Integration tests for API endpoints
 - Database transaction testing
 - Error handling verification

20. **Frontend Testing**
 - Component testing for enhanced dialogs
 - Integration testing for CRUD flows
 - User interaction testing
 - Error state testing

21. **Documentation**
 - API documentation completion
 - Frontend component documentation
 - Database schema documentation
 - Deployment guides

### Phase 6: Production Readiness

22. **Performance Optimization**
 - Database indexing strategy
 - Query optimization
 - Frontend bundle optimization
 - Caching strategies

23. **Security Hardening**
 - Input sanitization
 - SQL injection prevention
 - Rate limiting
 - CORS configuration

24. **Monitoring and Observability**
 - Health check endpoints
 - Metrics collection
 - Error tracking integration
 - Performance monitoring

## Testing

### Backend Testing Strategy

1. **Unit Tests**
- Service layer business logic
- Repository data access patterns
- Utility functions
- Validation schemas

2. **Integration Tests**
- API endpoint testing
- Database integration
- Error handling flows
- OpenAPI specification validation

3. **Performance Tests**
- Database query performance
- API response times
- Concurrent request handling
- Memory usage monitoring

### Frontend Testing Strategy

1. **Component Tests**
- Enhanced ingredient dialog
- Confirmation dialogs
- Form validation
- Error states

2. **Integration Tests**
- End-to-end CRUD workflows
- API integration
- State management
- User interactions

3. **Accessibility Tests**
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

### Database Testing

1. **Migration Tests**
- Schema migration validation
- Data migration verification
- Rollback procedures
- Constraint validation

2. **Data Integrity Tests**
- Foreign key constraints
- Data validation rules
- Transaction isolation
- Concurrent access patterns

## Technical Implementation Details

### Database Schema

```sql
-- Main ingredients table
CREATE TABLE ingredients (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 supplier_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')),
 category TEXT NOT NULL,
 type TEXT NOT NULL,
 brand TEXT,
 food_composition_id TEXT,
 
 -- Nutrition per 100g
 energy_per_100g REAL,
 protein_per_100g REAL,
 total_fat_per_100g REAL,
 saturated_fat_per_100g REAL,
 total_carb_per_100g REAL,
 total_sugars_per_100g REAL,
 sodium_mg_per_100g REAL,
 water_per_100g REAL,
 total_solids_per_100g REAL,
 other_solids_per_100g REAL,
 msnf_per_100g REAL,
 
 -- Sugars breakdown
 sucrose_per_100g REAL,
 fructose_per_100g REAL,
 glucose_per_100g REAL,
 dextrose_per_100g REAL,
 alcohol_per_100g REAL,
 other_sugars_per_100g REAL,
 
 -- Functional properties
 pac REAL,
 pod REAL,
 hf REAL,
 dry_cocoa_solids_per_100g REAL,
 cocoa_butter_per_100g REAL,
 
 -- Commercial
 supplier_code TEXT,
 package_size_in_grams REAL,
 cost_per_pack_in_cents_ex_gst INTEGER,
 cost_per_1000g_in_cents_ex_gst INTEGER,
 percent_of_useful_product REAL,
 
 -- Allergens (stored as JSON)
 allergens TEXT NOT NULL DEFAULT '{}',
 
 -- Timestamps
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 last_modified_at TEXT NOT NULL DEFAULT (datetime('now')),
 
 FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
);

-- Suppliers table
CREATE TABLE suppliers (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 email TEXT,
 phone TEXT,
 address TEXT,
 website TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 last_modified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX idx_ingredients_supplier_id ON ingredients(supplier_id);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_status ON ingredients(status);
CREATE INDEX idx_ingredients_name ON ingredients(name);
```

API Endpoints Structure
// GET /api/ingredients
interface GetIngredientsResponse {
  data: Ingredient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// POST /api/ingredients
interface CreateIngredientRequest {
  ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'lastModifiedAt'>;
}

// PUT /api/ingredients/:id
interface UpdateIngredientRequest {
  ingredient: Partial<Omit<Ingredient, 'id' | 'createdAt'>>;
}

// Error responses
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}