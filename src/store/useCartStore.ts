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

      transferGuestCart: async () => {
        const currentCart = get().cart;
        const token = useAuthStore.getState().token;
        
        if (!token || currentCart.items.length === 0) {
          return;
        }

        set({ isLoading: true });
        
        try {
          // Transfer each item from the guest cart to the server
          for (const item of currentCart.items) {
            for (let i = 0; i < item.quantity; i++) {
              await cartApi.addItemToCart(item.product.id);
            }
          }
          
          // After transfer, load the server cart
          const response = await cartApi.getCurrentCart();
          if (response.data?.data) {
            set({ 
              cart: response.data.data,
              isLoading: false,
              error: null
            });
            toast.success('Cart transferred successfully');
          }
        } catch (error) {
          console.error('Error transferring cart:', error);
          set({ 
            error: 'Failed to transfer cart',
            isLoading: false
          });
          toast.error('Failed to transfer cart');
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
              // toast.success('Item added to cart');
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
                  totalAmount: currentCart.totalAmount + product.price
                }
              });
            }
            // toast.success('Item added to cart');
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          toast.error('Failed to add item to cart');
        }
      },

      removeItem: async (productId) => {
        const token = useAuthStore.getState().token;
        const currentCart = get().cart;

        try {
          if (token) {
            // Remove from server cart for authenticated users
            const response = await cartApi.removeItemFromCart(productId);
            if (response.data?.data) {
              set({ cart: response.data.data });
              toast.success('Item removed from cart');
            }
          } else {
            // Handle guest cart locally
            const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
            set({
              cart: {
                ...currentCart,
                items: updatedItems,
                totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
              }
            });
            toast.success('Item removed from cart');
          }
        } catch (error) {
          console.error('Error removing item from cart:', error);
          toast.error('Failed to remove item from cart');
        }
      },

      clearCart: async () => {
        const token = useAuthStore.getState().token;

        try {
          if (token) {
            // Clear server cart for authenticated users
            await cartApi.clearCart();
          }
          // Always clear local state
          set({
            cart: {
              id: null,
              items: [],
              totalAmount: 0
            }
          });
          toast.success('Cart cleared');
        } catch (error) {
          console.error('Error clearing cart:', error);
          toast.error('Failed to clear cart');
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Listen for user login event
window.addEventListener('user-logged-in', () => {
  // Transfer guest cart to server cart when user logs in
  useCartStore.getState().transferGuestCart();
});