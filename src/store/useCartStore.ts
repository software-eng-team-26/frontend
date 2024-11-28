import { create } from 'zustand';
import { Cart, CartItem, cartApi } from '../services/cartApi';
import { Course } from '../types/course';
import { toast } from 'react-hot-toast';

interface CartStore {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: (cartId: number) => Promise<void>;
  clearCart: (cartId: number) => Promise<void>;
  fetchTotalAmount: (cartId: number) => Promise<void>;
  addItem: (course: Course) => void;
  clearError: () => void;
  removeItem: (itemId: number) => void;
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

  addItem: (course: Course) => 
    set((state) => {
      const existingItem = state.cart.items.find(
        item => item.id === course.id
      );

      if (existingItem) {
        toast.error('Item already in cart');
        return state;
      }

      const newItem: CartItem = {
        id: course.id,
        quantity: 1,
        unitPrice: course.price,
        title: course.title,
        thumbnail: course.thumbnail
      };

      toast.success('Added to cart!');
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, newItem],
          totalAmount: state.cart.totalAmount + course.price
        }
      };
    }),

  removeItem: (itemId: number) => 
    set((state) => {
      const itemToRemove = state.cart.items.find(item => item.id === itemId);
      if (!itemToRemove) return state;

      toast.success('Item removed from cart');
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.id !== itemId),
          totalAmount: state.cart.totalAmount - itemToRemove.unitPrice
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
      toast.success('Cart cleared successfully');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
      toast.error('Failed to clear cart');
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