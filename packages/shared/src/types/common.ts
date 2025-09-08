// Common/shared primitive types
export type ID = string;

export type ISODateString = string; // e.g., new Date().toISOString()

export type Status = "Active" | "Inactive";

export type IngredientPhysicalType = "Wet" | "Dry" | "Infusion" | "Topping";

export type IngredientCategory =
  | "Mix-in"
  | "Dried Fruit"
  | "Other"
  | "Flavour"
  | "Fruit"
  | "Sugar"
  | "Alcohol"
  | "Vegetable"
  | "Seed"
  | "Dairy"
  | "Chocolate"
  | "Oil"
  | "Stabilizer"
  | "Grain";
