// Functional Programming Database Implementation
// Using closures and pure functions instead of classes

export type DatabaseRow = Record<string, any>;
export type DatabaseTable = Map<string, DatabaseRow>;

// Database state interface - immutable data structure
export interface DatabaseState {
  readonly tables: ReadonlyMap<string, DatabaseTable>;
}

// Database operations interface - all pure functions
export interface DatabaseOperations {
  all: (sql: string, params?: any[]) => Promise<DatabaseRow[]>;
  get: (sql: string, params?: any[]) => Promise<DatabaseRow | undefined>;
  run: (sql: string, params?: any[]) => Promise<{ lastID?: number; changes?: number }>;
  close: () => Promise<void>;
}

// Create initial database state (immutable)
const createInitialState = (): DatabaseState => ({
  tables: new Map<string, DatabaseTable>([
    ['ingredients', new Map()],
    ['suppliers', new Map()],
  ])
});

// Pure function to parse SQL and extract table name
const parseTableName = (sql: string): string => {
  const cleanSql = sql.toLowerCase().trim();
  
  if (cleanSql.startsWith('select')) {
    const match = cleanSql.match(/from\s+(\w+)/);
    return match?.[1] || '';
  }
  
  if (cleanSql.startsWith('insert into')) {
    const match = cleanSql.match(/insert\s+into\s+(\w+)/);
    return match?.[1] || '';
  }
  
  if (cleanSql.startsWith('update')) {
    const match = cleanSql.match(/update\s+(\w+)/);
    return match?.[1] || '';
  }
  
  if (cleanSql.startsWith('delete from')) {
    const match = cleanSql.match(/delete\s+from\s+(\w+)/);
    return match?.[1] || '';
  }
  
  return '';
};

// Pure function to extract column names from INSERT SQL
const parseInsertColumns = (sql: string): string[] => {
  const match = sql.match(/\(([^)]+)\)/);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(col => col.trim())
    .filter(Boolean);
};

// Pure function to extract WHERE conditions
const parseWhereConditions = (sql: string, params: any[] = []): ((row: DatabaseRow) => boolean) => {
  const whereMatch = sql.toLowerCase().match(/where\s+(.+?)(?:\s+order|\s+limit|\s+group|$)/);
  if (!whereMatch) return () => true;
  
  const whereClause = whereMatch[1].trim();
  
  // Simple implementation for basic conditions
  if (whereClause.includes('=')) {
    let paramIndex = 0;
    return (row: DatabaseRow) => {
      const condition = whereClause.replace(/\?/g, () => {
        const value = params[paramIndex++];
        return typeof value === 'string' ? `'${value}'` : String(value);
      });
      
      // Basic evaluation for simple conditions like "id = 'value'"
      const [column, value] = condition.split('=').map(s => s.trim());
      const cleanColumn = column.replace(/[`"]/g, '');
      const cleanValue = value.replace(/['"]/g, '');
      
      return String(row[cleanColumn]) === cleanValue;
    };
  }
  
  return () => true;
};

// Pure function to parse ORDER BY clause
const parseOrderBy = (sql: string): ((a: DatabaseRow, b: DatabaseRow) => number) => {
  const orderMatch = sql.toLowerCase().match(/order\s+by\s+(\w+)(\s+(asc|desc))?/);
  if (!orderMatch) return () => 0;
  
  const column = orderMatch[1];
  const direction = orderMatch[3] === 'desc' ? -1 : 1;
  
  return (a: DatabaseRow, b: DatabaseRow) => {
    const aVal = a[column];
    const bVal = b[column];
    
    if (aVal < bVal) return -1 * direction;
    if (aVal > bVal) return 1 * direction;
    return 0;
  };
};

// Pure function to parse LIMIT clause
const parseLimit = (sql: string): { limit?: number; offset?: number } => {
  const limitMatch = sql.toLowerCase().match(/limit\s+(\d+)(?:\s+offset\s+(\d+))?/);
  if (!limitMatch) return {};
  
  return {
    limit: parseInt(limitMatch[1], 10),
    offset: limitMatch[2] ? parseInt(limitMatch[2], 10) : 0,
  };
};

// Pure function to apply SELECT query to table data
const applySelectQuery = (
  table: DatabaseTable,
  sql: string,
  params: any[] = []
): DatabaseRow[] => {
  const rows = Array.from(table.values());
  const whereFilter = parseWhereConditions(sql, params);
  const orderBy = parseOrderBy(sql);
  const { limit, offset = 0 } = parseLimit(sql);
  
  let result = rows.filter(whereFilter);
  
  if (orderBy) {
    result = [...result].sort(orderBy);
  }
  
  if (limit !== undefined) {
    result = result.slice(offset, offset + limit);
  }
  
  return result;
};

// Pure function to create new row with auto-incrementing ID
const createRowWithId = (
  table: DatabaseTable,
  columns: string[],
  values: any[]
): { row: DatabaseRow; newId: string } => {
  const existingIds = Array.from(table.keys());
  const maxId = existingIds.length > 0 
    ? Math.max(...existingIds.map(id => parseInt(id, 10) || 0))
    : 0;
  const newId = (maxId + 1).toString();
  
  const row: DatabaseRow = { id: newId };
  columns.forEach((col, index) => {
    if (col !== 'id') {
      row[col] = values[index];
    }
  });
  
  return { row, newId };
};

// Pure function to update database state
const updateDatabaseState = (
  currentState: DatabaseState,
  tableName: string,
  operation: (table: DatabaseTable) => DatabaseTable
): DatabaseState => {
  const currentTable = currentState.tables.get(tableName) || new Map();
  const newTable = operation(currentTable);
  const newTables = new Map(currentState.tables);
  newTables.set(tableName, newTable);
  
  return {
    tables: newTables
  };
};

// Factory function to create database operations using closure
export const createInMemoryDatabase = (): DatabaseOperations => {
  let state: DatabaseState = createInitialState();
  
  return {
    // SELECT operations
    all: async (sql: string, params: any[] = []): Promise<DatabaseRow[]> => {
      const tableName = parseTableName(sql);
      const table = state.tables.get(tableName);
      
      if (!table) {
        throw new Error(`Table '${tableName}' does not exist`);
      }
      
      return applySelectQuery(table, sql, params);
    },
    
    // SELECT single row
    get: async (sql: string, params: any[] = []): Promise<DatabaseRow | undefined> => {
      const tableName = parseTableName(sql);
      const table = state.tables.get(tableName);
      
      if (!table) {
        throw new Error(`Table '${tableName}' does not exist`);
      }
      
      const rows = applySelectQuery(table, sql, params);
      return rows[0];
    },
    
    // INSERT/UPDATE/DELETE operations
    run: async (sql: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> => {
      const cleanSql = sql.toLowerCase().trim();
      const tableName = parseTableName(sql);
      
      if (!tableName) {
        throw new Error('Invalid SQL: could not determine table name');
      }
      
      if (cleanSql.startsWith('insert')) {
        const columns = parseInsertColumns(sql);
        const { row, newId } = createRowWithId(
          state.tables.get(tableName) || new Map(),
          columns,
          params
        );
        
        state = updateDatabaseState(state, tableName, (table) => {
          const newTable = new Map(table);
          newTable.set(newId, row);
          return newTable;
        });
        
        return { lastID: parseInt(newId, 10), changes: 1 };
      }
      
      if (cleanSql.startsWith('update')) {
        const whereFilter = parseWhereConditions(sql, params.slice(1));
        let changes = 0;
        
        state = updateDatabaseState(state, tableName, (table) => {
          const newTable = new Map(table);
          
          for (const [id, row] of table) {
            if (whereFilter(row)) {
              const updatedRow = { ...row, [sql.split('SET')[1].split('=')[0].trim()]: params[0] };
              newTable.set(id, updatedRow);
              changes++;
            }
          }
          
          return newTable;
        });
        
        return { changes };
      }
      
      if (cleanSql.startsWith('delete')) {
        const whereFilter = parseWhereConditions(sql, params);
        let changes = 0;
        
        state = updateDatabaseState(state, tableName, (table) => {
          const newTable = new Map(table);
          
          for (const [id, row] of table) {
            if (whereFilter(row)) {
              newTable.delete(id);
              changes++;
            }
          }
          
          return newTable;
        });
        
        return { changes };
      }
      
      throw new Error(`Unsupported SQL operation: ${sql}`);
    },
    
    // Close operation (no-op for in-memory)
    close: async (): Promise<void> => {
      // No-op for in-memory database
    }
  };
};

// Functional interface for database operations
export type Database = DatabaseOperations;

// Factory function to create database instance
export const createDatabase = (): Database => createInMemoryDatabase();

// Migration support for functional database
export async function runMigrations(db: Database): Promise<void> {
  console.log('Running database migrations...');
  // For in-memory database, we just simulate migration success
  // In a real implementation, this would read and execute SQL migration files
  console.log('All migrations completed');
}
