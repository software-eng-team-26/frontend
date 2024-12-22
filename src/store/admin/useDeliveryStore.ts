import { create } from 'zustand';
import { deliveryApi } from '../../services/admin/deliveryApi';
import { toast } from 'react-hot-toast';

interface DeliveryState {
  deliveries: any[];
  pendingDeliveries: any[];
  completedDeliveries: any[];
  selectedDelivery: any | null;
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed' | 'cancelled';
  fetchDeliveries: () => Promise<void>;
  fetchPendingDeliveries: () => Promise<void>;
  fetchCompletedDeliveries: () => Promise<void>;
  updateDeliveryStatus: (id: string, status: 'completed' | 'cancelled') => Promise<void>;
  selectDelivery: (delivery: any) => void;
  clearSelectedDelivery: () => void;
  setFilter: (filter: DeliveryState['filter']) => void;
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  deliveries: [],
  pendingDeliveries: [],
  completedDeliveries: [],
  selectedDelivery: null,
  isLoading: false,
  error: null,
  filter: 'all',

  fetchDeliveries: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await deliveryApi.getAllDeliveries();
      set({ deliveries: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch deliveries' });
      toast.error('Failed to fetch deliveries');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPendingDeliveries: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await deliveryApi.getPendingDeliveries();
      set({ pendingDeliveries: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch pending deliveries' });
      toast.error('Failed to fetch pending deliveries');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompletedDeliveries: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await deliveryApi.getCompletedDeliveries();
      set({ completedDeliveries: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch completed deliveries' });
      toast.error('Failed to fetch completed deliveries');
    } finally {
      set({ isLoading: false });
    }
  },

  updateDeliveryStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      await deliveryApi.updateDeliveryStatus(id, status);
      await get().fetchDeliveries();
      toast.success(`Delivery marked as ${status}`);
    } catch (error: any) {
      set({ error: error.message || 'Failed to update delivery status' });
      toast.error('Failed to update delivery status');
    } finally {
      set({ isLoading: false });
    }
  },

  selectDelivery: (delivery) => set({ selectedDelivery: delivery }),
  clearSelectedDelivery: () => set({ selectedDelivery: null }),
  setFilter: (filter) => set({ filter }),
})); 