import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDto } from '../services/userApi';

interface UserState {
  currentUser: UserDto | null;
  setCurrentUser: (user: UserDto | null) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearCurrentUser: () => set({ currentUser: null }),
    }),
    {
      name: 'user-storage',
    }
  )
); 