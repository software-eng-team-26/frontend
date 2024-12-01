import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
      getToken: () => get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
);

const storedToken = localStorage.getItem('jwt_token');
if (storedToken) {
  useAuthStore.getState().setToken(storedToken);
} 