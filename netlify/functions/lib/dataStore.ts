import { getStore } from '@netlify/blobs';

interface Filter {
  [key: string]: any;
}

export class DataStore {
  private store: ReturnType<typeof getStore>;

  constructor() {
    const token = process.env.NETLIFY_BLOB_TOKEN;
    if (!token) {
      throw new Error('NETLIFY_BLOB_TOKEN is not set');
    }
    this.store = getStore({ name: 'enosoft-data', token });
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    try {
      const key = `${collection}/${id}`;
      const data = await this.store.get(key, { type: 'json' });
      return data as T;
    } catch (error) {
      if ((error as any).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAll<T>(collection: string): Promise<T[]> {
    try {
      const { blobs } = await this.store.list({ prefix: `${collection}/` });
      const items = await Promise.all(
        blobs.map(async (blob) => {
          const data = await this.store.get(blob.key, { type: 'json' });
          return data as T;
        })
      );
      return items;
    } catch (error) {
      console.error('Error fetching all items:', error);
      return [];
    }
  }

  async query<T>(collection: string, filters: Filter): Promise<T[]> {
    const allItems = await this.getAll<T>(collection);
    return allItems.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        const itemValue = (item as any)[key];
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }
        return itemValue === value;
      });
    });
  }

  async create<T>(collection: string, data: T): Promise<T> {
    const id = (data as any).id || this.generateId();
    const itemWithTimestamp = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const key = `${collection}/${id}`;
    await this.store.set(key, JSON.stringify(itemWithTimestamp));
    return itemWithTimestamp as T;
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T> {
    const existing = await this.getById<T>(collection, id);
    if (!existing) {
      throw new Error(`Item with id ${id} not found in ${collection}`);
    }
    const updated = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    const key = `${collection}/${id}`;
    await this.store.set(key, JSON.stringify(updated));
    return updated;
  }

  async delete(collection: string, id: string): Promise<void> {
    const key = `${collection}/${id}`;
    await this.store.delete(key);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const dataStore = new DataStore();
