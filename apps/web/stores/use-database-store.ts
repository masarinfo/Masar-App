import { create } from 'zustand';
import { IProperty, IDatabaseRow, PagePropertyType, ICreatePropertyDto, IDatabaseFieldOption } from '@masar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

interface DatabaseState {
  properties: IProperty[];
  rows: IDatabaseRow[];
  isLoading: boolean;
  error: string | null;
  isLocalMode: boolean;

  fetchDatabaseSchema: (pageId: string) => Promise<void>;
  createProperty: (dto: ICreatePropertyDto) => Promise<boolean>;
  deleteProperty: (propertyId: string, pageId: string) => Promise<boolean>;
  createRow: (pageId: string) => Promise<boolean>;
  updateCellData: (rowId: string, pageId: string, propertyId: string, value: any) => Promise<boolean>;
  deleteRow: (rowId: string, pageId: string) => Promise<boolean>;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  properties: [],
  rows: [],
  isLoading: false,
  error: null,
  isLocalMode: false,

  fetchDatabaseSchema: async (pageId) => {
    if (!pageId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;

    set({ isLoading: true, error: null });
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/pages/${pageId}`, { headers });

      if (!res.ok) throw new Error('API unavailable');

      const data = await res.json();
      set({ properties: data.properties, rows: data.rows, isLoading: false, isLocalMode: false });
    } catch {
      // Fallback to local demo mode
      console.log('🔄 Switching to local demo mode');
      const savedProps = typeof window !== 'undefined' ? localStorage.getItem(`masar_props_${pageId}`) : null;
      const savedRows = typeof window !== 'undefined' ? localStorage.getItem(`masar_rows_${pageId}`) : null;
      set({
        properties: savedProps ? JSON.parse(savedProps) : [],
        rows: savedRows ? JSON.parse(savedRows) : [],
        isLoading: false,
        isLocalMode: true,
        error: null,
      });
    }
  },

  createProperty: async (dto) => {
    const state = get();
    const newProperty: IProperty = {
      id: generateId(),
      name: dto.name,
      type: dto.type,
      options: dto.options || null,
      pageId: dto.pageId,
    };

    // If in local mode or API fails, handle locally
    if (state.isLocalMode) {
      const updatedProps = [...state.properties, newProperty];
      set({ properties: updatedProps });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_props_${dto.pageId}`, JSON.stringify(updatedProps));
      }
      return true;
    }

    // Try API first
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    set({ isLoading: true, error: null });
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/properties`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error('API failed');

      await get().fetchDatabaseSchema(dto.pageId);
      set({ isLoading: false });
      return true;
    } catch {
      // Fallback to local
      const updatedProps = [...get().properties, newProperty];
      set({ properties: updatedProps, isLoading: false, isLocalMode: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_props_${dto.pageId}`, JSON.stringify(updatedProps));
      }
      return true;
    }
  },

  deleteProperty: async (propertyId, pageId) => {
    const state = get();

    if (state.isLocalMode) {
      const updatedProps = state.properties.filter((p) => p.id !== propertyId);
      set({ properties: updatedProps });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_props_${pageId}`, JSON.stringify(updatedProps));
      }
      return true;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/properties/${propertyId}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('API failed');
      await get().fetchDatabaseSchema(pageId);
      return true;
    } catch {
      const updatedProps = get().properties.filter((p) => p.id !== propertyId);
      set({ properties: updatedProps, isLocalMode: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_props_${pageId}`, JSON.stringify(updatedProps));
      }
      return true;
    }
  },

  createRow: async (pageId) => {
    const state = get();
    const newRow: IDatabaseRow = {
      id: generateId(),
      pageId,
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (state.isLocalMode) {
      const updatedRows = [...state.rows, newRow];
      set({ rows: updatedRows });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_rows_${pageId}`, JSON.stringify(updatedRows));
      }
      return true;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/rows`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ pageId, data: {} }),
      });

      if (!res.ok) throw new Error('API failed');
      await get().fetchDatabaseSchema(pageId);
      return true;
    } catch {
      const updatedRows = [...get().rows, newRow];
      set({ rows: updatedRows, isLocalMode: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_rows_${pageId}`, JSON.stringify(updatedRows));
      }
      return true;
    }
  },

  updateCellData: async (rowId, pageId, propertyId, value) => {
    const state = get();
    const row = state.rows.find((r) => r.id === rowId);
    const updatedData = { ...(row?.data || {}), [propertyId]: value };

    // Optimistic local update always
    const updatedRows = state.rows.map((r) => (r.id === rowId ? { ...r, data: updatedData } : r));
    set({ rows: updatedRows });

    if (state.isLocalMode) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_rows_${pageId}`, JSON.stringify(updatedRows));
      }
      return true;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/rows/${rowId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ data: updatedData }),
      });

      if (!res.ok) throw new Error('API failed');
      return true;
    } catch {
      set({ isLocalMode: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_rows_${pageId}`, JSON.stringify(get().rows));
      }
      return true;
    }
  },

  deleteRow: async (rowId, pageId) => {
    const state = get();

    if (state.isLocalMode) {
      const updatedRows = state.rows.filter((r) => r.id !== rowId);
      set({ rows: updatedRows });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_rows_${pageId}`, JSON.stringify(updatedRows));
      }
      return true;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/rows/${rowId}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('API failed');
      await get().fetchDatabaseSchema(pageId);
      return true;
    } catch {
      const updatedRows = get().rows.filter((r) => r.id !== rowId);
      set({ rows: updatedRows, isLocalMode: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`masar_rows_${pageId}`, JSON.stringify(updatedRows));
      }
      return true;
    }
  },
}));
