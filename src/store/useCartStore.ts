import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductDto } from '../services/productApi';
import { cartApi } from '../services/cartApi';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';
import axios from 'axios';

interface CartState {
  cart: {
    id: number | null;
    items: Array<{
      id: number;
      product: ProductDto;
      quantity: number;
      totalPrice: number;
    }>;
    totalAmount: number;
  };
  isLoading: boolean;
  error: string | null;
  loadCart: () => Promise<void>;
  addItem: (product: ProductDto) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {
        id: null,
        items: [],
        totalAmount: 0
      },
      isLoading: false,
      error: null,

      loadCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.getCurrentCart();
          if (response.data?.data) {
            set({ 
              cart: response.data.data,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          set({ 
            error: 'Failed to load cart',
            isLoading: false
          });
        }
      },

      addItem: async (product) => {
        try {
          const response = await cartApi.addItemToCart(product.id);
          if (response.data?.data) {
            set({ cart: response.data.data });
          }
        } catch (error) {
          console.error('Error adding item:', error);
          throw error;
        }
      },

      removeItem: async (productId: number) => {
        try {
          const token = useAuthStore.getState().token;
          if (!token) {
            toast.error('Please sign in to manage your cart');
            return;
          }

          const currentCart = get().cart;
          if (!currentCart.id) {
            toast.error('No active cart found');
            return;
          }

          await cartApi.removeItemFromCart(currentCart.id, productId);
          const response = await cartApi.getCurrentCart();
          
          if (response.data?.data) {
            set({ cart: response.data.data });
            toast.success('Item removed from cart');
          }
        } catch (error) {
          console.error('Error removing item:', error);
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
              toast.error('Please sign in to manage your cart');
              useAuthStore.getState().clearToken();
            } else if (error.response?.status === 404) {
              toast.error('Cart or item not found');
            } else {
              toast.error('Failed to remove item from cart');
            }
          }
          throw error;
        }
      },

      clearCart: async () => {
        try {
          await cartApi.clearCart();
          set({ cart: { id: null, items: [], totalAmount: 0 } });
        } catch (error) {
          console.error('Error clearing cart:', error);
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);