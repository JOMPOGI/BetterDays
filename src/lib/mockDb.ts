const STORAGE_KEY = 'better_days_mock_db';

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  return { inquiries: [] };
};

const saveDb = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

class MockQueryBuilder {
  private tableName: string;
  private action: 'select' | 'insert' | 'update' | 'delete' | null = null;
  private dataPayload: any = null;
  private filters: Array<(item: any) => boolean> = [];
  private orderConfig: { column: string, ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private returnSingle: boolean = false;
  private selectFields: string[] | '*' = '*';

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields: string = '*') {
    this.action = 'select';
    if (fields === '*') {
      this.selectFields = '*';
    } else {
      this.selectFields = fields.split(',').map(s => s.trim());
    }
    return this;
  }

  insert(data: any[]) {
    this.action = 'insert';
    this.dataPayload = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.dataPayload = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((item) => item[column] >= value);
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((item) => item[column] <= value);
    return this;
  }

  order(column: string, options: { ascending?: boolean } = { ascending: true }) {
    this.orderConfig = { column, ascending: options.ascending ?? true };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.returnSingle = true;
    return this;
  }

  async then(resolve: (value: any) => void, reject: (reason?: any) => void) {
    try {
      const result = this.execute();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }

  private execute() {
    const db = getDb();
    let tableData = db[this.tableName] || [];

    if (this.action === 'select') {
      let result = [...tableData];
      
      // Apply filters
      for (const filter of this.filters) {
        result = result.filter(filter);
      }
      
      // Apply sorting
      if (this.orderConfig) {
        const { column, ascending } = this.orderConfig;
        result.sort((a, b) => {
          if (a[column] < b[column]) return ascending ? -1 : 1;
          if (a[column] > b[column]) return ascending ? 1 : -1;
          return 0;
        });
      }
      
      // Apply limit
      if (this.limitCount !== null) {
        result = result.slice(0, this.limitCount);
      }
      
      // Apply select fields
      if (this.selectFields !== '*') {
        result = result.map(item => {
          const projected: any = {};
          for (const field of (this.selectFields as string[])) {
            projected[field] = item[field];
          }
          return projected;
        });
      }
      
      if (this.returnSingle) {
        return { data: result[0] || null, error: null };
      }
      return { data: result, error: null };

    } else if (this.action === 'insert') {
      const itemsToInsert = this.dataPayload.map((item: any) => ({
        id: crypto.randomUUID(),
        ...item
      }));
      db[this.tableName] = [...tableData, ...itemsToInsert];
      saveDb(db);
      return { data: itemsToInsert, error: null };

    } else if (this.action === 'update') {
      db[this.tableName] = tableData.map((item: any) => {
        let match = true;
        for (const filter of this.filters) {
          if (!filter(item)) {
            match = false;
            break;
          }
        }
        if (match) {
          return { ...item, ...this.dataPayload };
        }
        return item;
      });
      saveDb(db);
      return { data: null, error: null };

    } else if (this.action === 'delete') {
      db[this.tableName] = tableData.filter((item: any) => {
        let match = true;
        for (const filter of this.filters) {
          if (!filter(item)) {
            match = false;
            break;
          }
        }
        // If it matches all filters, we remove it (return false)
        return !match;
      });
      saveDb(db);
      return { data: null, error: null };
    }

    return { data: null, error: 'Unknown action' };
  }
}

export const mockSupabase = {
  from: (tableName: string) => {
    return new MockQueryBuilder(tableName);
  },
  rpc: async (fnName: string, params: any) => {
    if (fnName === 'get_public_availability') {
      const db = getDb();
      const inquiries = db.inquiries || [];
      const result = inquiries.filter((i: any) => {
        return i.event_date >= params.start_date && i.event_date <= params.end_date;
      }).map((i: any) => ({
        event_date: i.event_date,
        status: i.status
      }));
      return { data: result, error: null };
    }
    return { data: null, error: 'Unknown RPC' };
  }
};
