import { create } from 'zustand';
import { IProperty, IDatabaseRow, PagePropertyType, ICreatePropertyDto, IDatabaseFieldOption } from '@masar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface DatabaseState {
  properties: IProperty[];
  rows: IDatabaseRow[];
  isLoading: boolean;
  error: string | null;

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

  fetchDatabaseSchema: async (pageId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!pageId) return;

    set({ isLoading: true, error: null });
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      
      const res = await fetch(`${API_URL}/database/pages/${pageId}`, {
        headers,
      });

      if (!res.ok) throw new Error('فشل تحميل هيكل قاعدة البيانات');

      const data = await res.json();
      set({ properties: data.properties, rows: data.rows, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createProperty: async (dto) => {
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

      if (!res.ok) throw new Error('فشل إضافة الخاصية');

      await get().fetchDatabaseSchema(dto.pageId);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  deleteProperty: async (propertyId, pageId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/properties/${propertyId}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('فشل حذف الخاصية');

      await get().fetchDatabaseSchema(pageId);
      return true;
    } catch {
      return false;
    }
  },

  createRow: async (pageId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/rows`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ pageId, data: {} }),
      });

      if (!res.ok) throw new Error('فشل إضافة صف جديد');

      await get().fetchDatabaseSchema(pageId);
      return true;
    } catch {
      return false;
    }
  },

  updateCellData: async (rowId, pageId, propertyId, value) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    const row = get().rows.find((r) => r.id === rowId);
    const updatedData = { ...(row?.data || {}), [propertyId]: value };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/rows/${rowId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ data: updatedData }),
      });

      if (!res.ok) throw new Error('فشل تحديث الخلية');

      // Optimistic update
      set((state) => ({
        rows: state.rows.map((r) => (r.id === rowId ? { ...r, data: updatedData } : r)),
      }));

      return true;
    } catch {
      return false;
    }
  },

  deleteRow: async (rowId, pageId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/database/rows/${rowId}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('فشل حذف الصف');

      await get().fetchDatabaseSchema(pageId);
      return true;
    } catch {
      return false;
    }
  },
}));
