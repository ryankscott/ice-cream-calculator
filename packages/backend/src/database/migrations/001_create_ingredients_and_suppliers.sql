-- Create suppliers table
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

-- Create ingredients table
CREATE TABLE ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')),
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Wet', 'Dry')),
  brand TEXT DEFAULT '',
  food_composition_id TEXT DEFAULT '',
  
  -- Nutrition per 100g
  energy_per_100g REAL DEFAULT 0,
  protein_per_100g REAL DEFAULT 0,
  total_fat_per_100g REAL DEFAULT 0,
  saturated_fat_per_100g REAL DEFAULT 0,
  total_carb_per_100g REAL DEFAULT 0,
  total_sugars_per_100g REAL DEFAULT 0,
  sodium_mg_per_100g REAL DEFAULT 0,
  water_per_100g REAL DEFAULT 0,
  total_solids_per_100g REAL DEFAULT 0,
  other_solids_per_100g REAL DEFAULT 0,
  msnf_per_100g REAL DEFAULT 0,
  
  -- Sugars breakdown
  sucrose_per_100g REAL DEFAULT 0,
  fructose_per_100g REAL DEFAULT 0,
  glucose_per_100g REAL DEFAULT 0,
  dextrose_per_100g REAL DEFAULT 0,
  alcohol_per_100g REAL DEFAULT 0,
  other_sugars_per_100g REAL DEFAULT 0,
  
  -- Functional properties
  pac REAL DEFAULT 0,
  pod REAL DEFAULT 0,
  hf REAL DEFAULT 0,
  dry_cocoa_solids_per_100g REAL DEFAULT 0,
  cocoa_butter_per_100g REAL DEFAULT 0,
  
  -- Commercial
  supplier_code TEXT DEFAULT '',
  package_size_in_grams REAL DEFAULT 0,
  cost_per_pack_in_cents_ex_gst INTEGER DEFAULT 0,
  cost_per_1000g_in_cents_ex_gst INTEGER DEFAULT 0,
  percent_of_useful_product REAL DEFAULT 100,
  
  -- Allergens (stored as JSON)
  allergens TEXT NOT NULL DEFAULT '{}',
  
  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_modified_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
);

-- Indexes for performance
CREATE INDEX idx_ingredients_supplier_id ON ingredients(supplier_id);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_status ON ingredients(status);
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_type ON ingredients(type);
