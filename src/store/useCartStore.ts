import { create } from 'zustand';
import { Cart, CartItem, cartApi } from '../services/cartApi';
import { Course } from '../types/course';

interface CartStore {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: (cartId: number) => Promise<void>;
  clearCart: (cartId: number) => Promise<void>;
  fetchTotalAmount: (cartId: number) => Promise<void>;
  addItem: (course: Course) => void;
  clearError: () => void;
}

const initialCart: Cart = {
  id: 0,
  totalAmount: 0,
  items: [],
  userId: 0,
};

export const useCartStore = create<CartStore>((set) => ({
  cart: initialCart,
  isLoading: false,
  error: null,

  addItem: (course) => 
    set((state) => {
      const existingItem = state.cart.items.find(
        item => item.id === course.id
      );

      if (existingItem) {
        return state;
      }

      const newItem: CartItem = {
        id: course.id,
        quantity: 1,
        unitPrice: course.price,
      };

      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, newItem],
          totalAmount: state.cart.totalAmount + course.price
        }
      };
    }),

  fetchCart: async (cartId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.getCart(cartId);
      set({ 
        cart: response.data ?? initialCart,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  clearCart: async (cartId) => {
    set({ isLoading: true, error: null });
    try {
      await cartApi.clearCart(cartId);
      set({ 
        cart: initialCart,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  fetchTotalAmount: async (cartId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.getTotalAmount(cartId);
      set((state) => ({
        cart: {
          ...state.cart,
          totalAmount: response.data ?? 0,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));