import { create } from 'zustand';
import { orderApi } from '../../services/orderApi';
import { Order } from '../../types/order';
import { toast } from 'react-hot-toast';

interface OrderManagementState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

export const useOrderManagementStore = create<OrderManagementState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await orderApi.getAllOrders();
      set({ orders: response.data.data || [] });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  }
})); 