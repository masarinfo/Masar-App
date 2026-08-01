import { create } from 'zustand';
import { IWorkspace, IMember, ICreateWorkspaceDto, UserRole } from '@masar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface WorkspaceState {
  workspaces: (IWorkspace & { role?: UserRole })[];
  activeWorkspace: (IWorkspace & { members?: IMember[] }) | null;
  isLoading: boolean;
  error: string | null;

  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (dto: ICreateWorkspaceDto) => Promise<IWorkspace | null>;
  selectWorkspaceBySlug: (slug: string) => Promise<void>;
  addMember: (email: string, role?: UserRole) => Promise<boolean>;
  removeMember: (memberId: string) => Promise<boolean>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/workspaces`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('فشل جلب مساحات العمل');

      const workspaces = await res.json();
      set({ workspaces, isLoading: false });

      if (workspaces.length > 0 && !get().activeWorkspace) {
        get().selectWorkspaceBySlug(workspaces[0].slug);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createWorkspace: async (dto) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token) return null;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      const workspace = await res.json();
      if (!res.ok) throw new Error(workspace.message || 'فشل إنشاء مساحة العمل');

      await get().fetchWorkspaces();
      await get().selectWorkspaceBySlug(workspace.slug);

      set({ isLoading: false });
      return workspace;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  selectWorkspaceBySlug: async (slug) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const encodedSlug = encodeURIComponent(slug);
      const res = await fetch(`${API_URL}/workspaces/${encodedSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('فشل تحميل تفاصيل مساحة العمل');

      const activeWorkspace = await res.json();
      set({ activeWorkspace, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addMember: async (email, role = UserRole.MEMBER) => {
    const active = get().activeWorkspace;
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!active || !token) return false;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/workspaces/${active.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل إضافة العضو');

      await get().selectWorkspaceBySlug(active.slug);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  removeMember: async (memberId) => {
    const active = get().activeWorkspace;
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!active || !token) return false;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/workspaces/${active.id}/members/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'فشل حذف العضو');
      }

      await get().selectWorkspaceBySlug(active.slug);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
