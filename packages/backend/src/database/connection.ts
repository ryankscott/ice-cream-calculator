import path from 'path';
import fs from 'fs';

export interface DatabaseInterface {
  get: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
  run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
  close: () => Promise<void>;
}

// Simple in-memory database for demonstration
class InMemoryDatabase implements DatabaseInterface {
  private tables: Map<string, Map<string, any>> = new Map();
  private lastInsertId = 0;

  async get(sql: string, params?: any[]): Promise<any> {
    // Simple implementation for basic queries
    if (sql.includes('SELECT COUNT(*) as count FROM suppliers')) {
      const suppliers = this.tables.get('suppliers') || new Map();
      return { count: suppliers.size };
    }
    if (sql.includes('SELECT filename FROM migrations')) {
      return null; // No migrations found
    }
    
    return null;
  }

  async all(sql: string, params?: any[]): Promise<any[]> {
    // Simple implementation for getting all records
    if (sql.includes('FROM suppliers')) {
      const suppliers = this.tables.get('suppliers') || new Map();
      return Array.from(suppliers.values());
    }
    if (sql.includes('FROM ingredients')) {
      const ingredients = this.tables.get('ingredients') || new Map();
      return Array.from(ingredients.values()).slice(0, 20); // Simulate pagination
    }
    
    return [];
  }

  async run(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> {
    this.lastInsertId++;
    
    if (sql.includes('INSERT INTO suppliers')) {
      const suppliers = this.tables.get('suppliers') || new Map();
      const id = params?.[0] || `sup-${this.lastInsertId}`;
      suppliers.set(id, {
        id,
        name: params?.[1] || 'Sample Supplier',
        email: params?.[2] || 'contact@supplier.com',
        phone: params?.[3] || '+1-555-0000',
        address: params?.[4] || '123 Main St',
        website: params?.[5] || 'https://supplier.com'
      });
      this.tables.set('suppliers', suppliers);
      return { lastID: this.lastInsertId, changes: 1 };
    }
    
    if (sql.includes('INSERT INTO ingredients')) {
      const ingredients = this.tables.get('ingredients') || new Map();
      const id = params?.[0] || `ing-${this.lastInsertId}`;
      ingredients.set(id, {
        id,
        name: params?.[1] || 'Sample Ingredient',
        supplier_id: params?.[2] || 'sup-1',
        // Add other fields as needed
      });
      this.tables.set('ingredients', ingredients);
      return { lastID: this.lastInsertId, changes: 1 };
    }
    
    return { lastID: this.lastInsertId, changes: 0 };
  }

  async close(): Promise<void> {
    // Nothing to close for in-memory database
  }
}

export async function createConnection(dbPath?: string): Promise<DatabaseInterface> {
  return new InMemoryDatabase();
}

export async function runMigrations(db: DatabaseInterface): Promise<void> {
  console.log('Running database migrations...');
  // For in-memory database, we just simulate migration success
  console.log('All migrations completed');
}
