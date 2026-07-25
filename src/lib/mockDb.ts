const STORAGE_KEY = 'better_days_mock_db_v3';

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    return parsed;
  }
  
  // Generate 10 mock clients
  const mockClients = Array.from({ length: 10 }).map((_, i) => ({
    id: crypto.randomUUID(),
    full_name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    phone: `555-010${i}`,
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updated_at: new Date().toISOString()
  }));

  // Generate 10 mock inquiries/bookings
  const eventTypes = ['WEDDING', 'PRENUP'];
  const locations = ['Grand Hotel', 'Studio A', 'Beach Resort', 'City Hall', 'Botanical Gardens', 'Downtown Studio'];
  const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  const mockInquiries = mockClients.map((client, i) => {
    return {
      id: crypto.randomUUID(),
      client_id: client.id,
      event_type: eventTypes[i % eventTypes.length],
      event_date: new Date(Date.now() + (i * 86400000 * 3)).toISOString().split('T')[0],
      start_time: '10:00',
      end_time: '14:00',
      location: locations[i % locations.length],
      project_notes: `Looking forward to our ${eventTypes[i % eventTypes.length].toLowerCase()} shoot.`,
      status: statuses[i % statuses.length],
      source: 'WEBSITE',
      is_read: i % 2 === 0,
      is_archived: i === 9,
      is_deleted: false,
      created_at: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  const mockBookings = mockInquiries
    .filter(inq => ['CONFIRMED', 'COMPLETED'].includes(inq.status))
    .map(inq => ({
      id: crypto.randomUUID(),
      inquiry_id: inq.id,
      client_id: inq.client_id,
      event_date: inq.event_date,
      start_time: inq.start_time,
      end_time: inq.end_time,
      location: inq.location,
      status: inq.status,
      created_at: inq.created_at,
      updated_at: inq.updated_at
    }));
  
  const seed = { 
    clients: mockClients, 
    inquiries: mockInquiries, 
    bookings: mockBookings, 
    admin_notes: [], 
    notifications: [],
    portfolio: [] 
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
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

  insert(data: any | any[]) {
    this.action = 'insert';
    this.dataPayload = Array.isArray(data) ? data : [data];
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
            // Note: Doesn't properly support foreign key joins like "clients(full_name)" in this simple mock
            // But good enough for basic tests
            if (field.includes('(')) continue; 
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
      const itemsToInsert = this.dataPayload.map((item: any) => {
        const id = item.id || crypto.randomUUID();
        
        // Trigger notification if it's an inquiry
        if (this.tableName === 'inquiries') {
          const notifs = db.notifications || [];
          db.notifications = [...notifs, {
            id: crypto.randomUUID(),
            type: 'NEW_INQUIRY',
            title: 'New Inquiry',
            message: `New inquiry received for a ${item.event_type || 'event'}`,
            is_read: false,
            created_at: new Date().toISOString(),
          }];
        }
        
        return {
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item
        };
      });
      db[this.tableName] = [...tableData, ...itemsToInsert];
      saveDb(db);
      
      if (this.returnSingle) {
        return { data: itemsToInsert[0], error: null };
      }
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
          return { ...item, ...this.dataPayload, updated_at: new Date().toISOString() };
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
      const bookings = db.bookings || [];
      const result = bookings.filter((b: any) => {
        return b.event_date >= params.req_start_date && b.event_date <= params.req_end_date && ['CONFIRMED', 'COMPLETED'].includes(b.status);
      }).map((b: any) => ({
        event_date: b.event_date,
        is_available: false
      }));
      return { data: result, error: null };
    }
    if (fnName === 'submit_inquiry') {
      const db = getDb();
      let clients = db.clients || [];
      let client = clients.find((c: any) => c.email === params.p_email);
      
      if (!client) {
        client = {
          id: crypto.randomUUID(),
          full_name: params.p_name,
          email: params.p_email,
          phone: params.p_phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        db.clients = [...clients, client];
      }

      const inquiry = {
        id: crypto.randomUUID(),
        client_id: client.id,
        event_type: params.p_event_type,
        event_date: params.p_event_date,
        start_time: params.p_start_time,
        end_time: params.p_end_time,
        location: params.p_location,
        project_notes: params.p_notes,
        status: 'NEW',
        source: 'WEBSITE',
        is_read: false,
        is_archived: false,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      db.inquiries = [...(db.inquiries || []), inquiry];
      
      // Notification
      const notifs = db.notifications || [];
      db.notifications = [...notifs, {
        id: crypto.randomUUID(),
        type: 'NEW_INQUIRY',
        title: 'New Inquiry',
        message: `New inquiry received for a ${params.p_event_type || 'event'}`,
        is_read: false,
        created_at: new Date().toISOString(),
      }];
      
      saveDb(db);
      return { data: inquiry, error: null };
    }
    return { data: null, error: 'Unknown RPC' };
  }
};
