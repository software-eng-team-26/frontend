import { create } from 'zustand';
import { Order, orderApi } from '../services/orderApi';
import { toast } from 'react-hot-toast';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (cartId: number) => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  fetchUserOrders: (userId: number) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  createOrder: async (cartId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.createOrder(cartId);
      set((state) => ({
        currentOrder: response.data ?? null,
        orders: [...state.orders, response.data!],
        isLoading: false,
      }));
      toast.success('Order placed successfully!');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      toast.error('Failed to place order');
    }
  },

  fetchOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getOrder(orderId);
      set({ currentOrder: response.data ?? null, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  fetchUserOrders: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getUserOrders(userId);
      set({ orders: response.data ?? [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },
})); 