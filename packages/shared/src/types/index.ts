// Barrel exports for lib types. Split into focused modules for maintainability.
export * from "./common";
export * from "./nutrition";

// Export auto-generated types from OpenAPI schema (replaces manual allergens, supplier, ingredient types)
export * from "./api-generated";

// Note: allergens.ts, supplier.ts, and ingredient.ts are replaced by the auto-generated types