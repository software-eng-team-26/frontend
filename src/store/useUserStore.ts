import { create } from 'zustand';
import { UserDto, userApi, CreateUserRequest, UserUpdateRequest, SignInRequest } from '../services/api';

interface UserStore {
  currentUser: UserDto | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (userId: number) => Promise<void>;
  createUser: (request: CreateUserRequest) => Promise<void>;
  updateUser: (userId: number, request: UserUpdateRequest) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  clearError: () => void;
  signIn: (request: SignInRequest) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.getUserById(userId);
      set({ currentUser: response.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  createUser: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.createUser(request);
      set({ currentUser: response.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  updateUser: async (userId, request) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.updateUser(userId, request);
      set({ currentUser: response.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await userApi.deleteUser(userId);
      set({ currentUser: null, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  signIn: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.signIn(request);
      set({ currentUser: response.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },
})); 