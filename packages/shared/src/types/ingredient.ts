import type {
  ID,
  IngredientCategory,
  IngredientPhysicalType,
  ISODateString,
  Status,
} from "./common";
import type { Sugars } from "./nutrition";
import type { Supplier } from "./supplier";
import type { Allergens } from "./allergens";

export type Ingredient = {
  id: ID;
  name: string;
  supplierID: ID;
  status: Status;
  category: IngredientCategory;
  type: IngredientPhysicalType;
  brand: string;
  foodCompositionID: string;

  // Nutrition per 100g
  energyPer100g: number;
  proteinPer100g: number;
  totalFatPer100g: number;
  saturatedFatPer100g: number;
  totalCarbPer100g: number;
  totalSugarsPer100g: number;
  sodiumMgPer100g: number;
  waterPer100g: number;
  sugarsPer100g: Sugars;
  totalSolidsPer100g: number;
  otherSolidsPer100g: number;
  MSNFPer100g: number;

  // Functional properties
  PAC: number;
  POD: number;
  HF: number;
  dryCocoaSolidsPer100g: number;
  cocoaButterPer100g: number;

  // Commercial
  supplier: Supplier; // denormalized convenience
  supplierCode: string | number;
  packageSizeInGrams: number;
  costPerPackInCentsExGST: number;
  costPer1000gInCentsExGST: number;
  percentOfUsefulProduct: number;

  // Compliance
  allergens: Allergens;
  createdAt: ISODateString;
  lastModifiedAt: ISODateString;
};
