import { create } from 'zustand';
import { ProductDto } from '../services/productApi';
import { addToWishlist, removeFromWishlist, getWishlist } from '../services/wishlistApi';

interface WishlistState {
  items: any[];
  isLoading: boolean;
  error: string | null;
  addItem: (userId: number, productId: number) => Promise<void>;
  removeItem: (userId: number, productId: number) => Promise<void>;
  fetchWishlist: (userId: number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: async (userId: number, productId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await addToWishlist(userId, productId);
      set({ items: response.products });
    } catch (error) {
      set({ error: 'Failed to add item to wishlist' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (userId: number, productId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await removeFromWishlist(userId, productId);
      set({ items: response.products });
    } catch (error) {
      set({ error: 'Failed to remove item from wishlist' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWishlist: async (userId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getWishlist(userId);
      set({ items: response.products });
    } catch (error) {
      set({ error: 'Failed to fetch wishlist', items: [] });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearWishlist: () => {
    set({ items: [], error: null });
  }
})); 