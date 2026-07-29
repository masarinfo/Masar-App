import { create } from 'zustand';
import { IUser, ILoginRequest, IRegisterRequest } from '@masar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: ILoginRequest) => Promise<boolean>;
  register: (data: IRegisterRequest) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('masar_token') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'فشل تسجيل الدخول');
      }

      localStorage.setItem('masar_token', data.accessToken);
      localStorage.setItem('masar_refresh_token', data.refreshToken);

      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'حدث خطأ أثناء الاتصال بالخادم', isLoading: false });
      return false;
    }
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'فشل إنشاء الحساب');
      }

      localStorage.setItem('masar_token', data.accessToken);
      localStorage.setItem('masar_refresh_token', data.refreshToken);

      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'حدث خطأ أثناء تسجيل الحساب', isLoading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('masar_token');
      localStorage.removeItem('masar_refresh_token');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('التوكن غير صالحة');
      }

      const user = await res.json();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      get().logout();
      set({ isLoading: false });
    }
  },
}));
