import { create } from 'zustand';
import { deliveryManagementApi } from '../../services/admin/deliveryManagementApi';
import { Order, OrderStatus } from '../../types/order';
import { toast } from 'react-hot-toast';

interface DeliveryManagementState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  updateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

export const useDeliveryManagementStore = create<DeliveryManagementState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const orders = await deliveryManagementApi.getAllOrders();
      console.log('Store received orders:', orders);
      
      if (!Array.isArray(orders)) {
        console.error('Expected array of orders but got:', orders);
        set({ orders: [] });
        return;
      }
      
      set({ orders });
    } catch (error: any) {
      console.error('Store error:', error);
      set({ error: error.message || 'Failed to fetch orders' });
      toast.error('Failed to fetch orders');
    } finally {
      set({ isLoading: false });
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      set({ isLoading: true, error: null });
      await deliveryManagementApi.updateOrderStatus(orderId, status);
      await get().fetchOrders();
      toast.success(`Order status updated to ${status}`);
    } catch (error: any) {
      set({ error: error.message || 'Failed to update order status' });
      toast.error('Failed to update order status');
    } finally {
      set({ isLoading: false });
    }
  }
})); 