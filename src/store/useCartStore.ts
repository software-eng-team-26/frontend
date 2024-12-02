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
  transferGuestCart: () => Promise<void>;
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
        const token = useAuthStore.getState().token;

        try {
          if (token) {
            // Load server cart for authenticated users
            const response = await cartApi.getCurrentCart();
            if (response.data?.data) {
              set({ 
                cart: response.data.data,
                isLoading: false,
                error: null
              });
            }
          }
          // For guests, the cart is already loaded from localStorage via persist
          set({ isLoading: false });
        } catch (error) {
          console.error('Error loading cart:', error);
          set({ 
            error: 'Failed to load cart',
            isLoading: false
          });
        }
      },

      addItem: async (product) => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart;

        try {
          if (token) {
            // Add to server cart for authenticated users
            const response = await cartApi.addItemToCart(product.id);
            if (response.data?.data) {
              set({ cart: response.data.data });
            }
          } else {
            // Handle guest cart locally
            const existingItem = currentCart.items.find(item => item.product.id === product.id);
            
            if (existingItem) {
              // Update quantity if item exists
              const updatedItems = currentCart.items.map(item =>
                item.product.id === product.id
                  ? { 
                      ...item, 
                      quantity: item.quantity + 1,
                      totalPrice: (item.quantity + 1) * product.price
                    }
                  : item
              );
              
              set({
                cart: {
                  ...currentCart,
                  items: updatedItems,
                  totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
                }
              });
            } else {
              // Add new item
              const newItem = {
                id: Date.now(), // Temporary ID for guest cart
                product,
                quantity: 1,
                totalPrice: product.price
              };
              
              set({
                cart: {
                  ...currentCart,
                  items: [...currentCart.items, newItem],
                  totalAmount: currentCart.totalAmount + newItem.totalPrice
                }
              });
            }
          }
        } catch (error) {
          console.error('Error adding item:', error);
          throw error;
        }
      },

      removeItem: async (productId: number) => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart;

        try {
          if (token) {
            // Remove from server cart for authenticated users
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
          } else {
            // Handle guest cart locally
            const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            
            set({
              cart: {
                ...currentCart,
                items: updatedItems,
                totalAmount: newTotalAmount
              }
            });
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
        const token = useAuthStore.getState().token;

        try {
          if (token) {
            await cartApi.clearCart();
          }
          set({ cart: { id: null, items: [], totalAmount: 0 } });
        } catch (error) {
          console.error('Error clearing cart:', error);
          throw error;
        }
      },

      transferGuestCart: async () => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart;

        if (token && currentCart.items.length > 0) {
          try {
            // Transfer each item from guest cart to server
            await Promise.all(
              currentCart.items.map(async (item) => {
                try {
                  // Use the server's addItem endpoint for each item
                  await cartApi.addItemToCart(item.product.id, item.quantity);
                } catch (error) {
                  console.error('Failed to transfer item:', error);
                  throw error;
                }
              })
            );

            // After successful transfer, load the server cart
            const response = await cartApi.getCurrentCart();
            if (response.data?.data) {
              set({ cart: response.data.data });
            }

            toast.success('Cart items transferred successfully');
          } catch (error) {
            console.error('Failed to transfer guest cart:', error);
            toast.error('Failed to transfer cart items');
            throw error;
          }
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);