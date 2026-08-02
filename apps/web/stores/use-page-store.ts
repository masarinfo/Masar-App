import { create } from 'zustand';
import { IPageTreeNode, IPage, ICreatePageDto, IUpdatePageDto } from '@masar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface PageState {
  pageTree: IPageTreeNode[];
  activePage: IPage | null;
  isLoading: boolean;
  error: string | null;

  fetchPageTree: (workspaceId: string) => Promise<void>;
  createPage: (dto: ICreatePageDto) => Promise<IPage | null>;
  selectPage: (pageId: string) => Promise<void>;
  updatePage: (pageId: string, dto: IUpdatePageDto) => Promise<boolean>;
  deletePage: (pageId: string, workspaceId: string) => Promise<boolean>;
  togglePublish: (pageId: string, isPublished: boolean) => Promise<boolean>;
}

export const usePageStore = create<PageState>((set, get) => ({
  pageTree: [],
  activePage: null,
  isLoading: false,
  error: null,

  fetchPageTree: async (workspaceId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token || !workspaceId) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/pages/workspace/${workspaceId}/tree`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('فشل تحميل شجرة المستندات');

      const pageTree = await res.json();
      set({ pageTree, isLoading: false });

      if (pageTree.length > 0 && !get().activePage) {
        get().selectPage(pageTree[0].id);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createPage: async (dto) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token) return null;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      const page = await res.json();
      if (!res.ok) throw new Error(page.message || 'فشل إنشاء المستند');

      await get().fetchPageTree(dto.workspaceId);
      set({ activePage: page, isLoading: false });

      return page;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  selectPage: async (pageId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token || !pageId) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/pages/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('فشل جلب المستند');

      const activePage = await res.json();
      set({ activePage, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updatePage: async (pageId, dto) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    const active = get().activePage;
    if (!token || !pageId) return false;

    // Optimistic UI Update
    if (active?.id === pageId) {
      set({ activePage: { ...active, ...dto } as IPage });
    }
    
    // Optimistic Tree Update
    const currentTree = get().pageTree;
    const updateNodeInTree = (nodes: IPageTreeNode[]): IPageTreeNode[] => {
      return nodes.map(node => {
        if (node.id === pageId) {
          return { ...node, ...dto } as IPageTreeNode;
        }
        if (node.children) {
          return { ...node, children: updateNodeInTree(node.children) };
        }
        return node;
      });
    };
    // Note: We don't optimistically move nodes (parentId change) because it's complex, we just wait for the server refresh for that.
    if (dto.title !== undefined || dto.icon !== undefined || dto.isFavorite !== undefined) {
      set({ pageTree: updateNodeInTree(currentTree) });
    }

    try {
      const res = await fetch(`${API_URL}/pages/${pageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error('فشل تحديث المستند');

      const updated = await res.json();
      if (active?.id === pageId) {
        set({ activePage: updated });
      }

      if (active?.workspaceId) {
        get().fetchPageTree(active.workspaceId);
      }

      return true;
    } catch {
      return false;
    }
  },

  deletePage: async (pageId, workspaceId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null;
    if (!token || !pageId) return false;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/pages/${pageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('فشل حذف المستند');

      await get().fetchPageTree(workspaceId);
      set({ activePage: null, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  togglePublish: async (pageId, isPublished) => {
    return get().updatePage(pageId, { isPublished });
  },
}));
