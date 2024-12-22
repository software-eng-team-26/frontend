import { create } from 'zustand';
import { discountApi } from '../../services/admin/discountApi';
import { toast } from 'react-hot-toast';

interface DiscountState {
  discounts: any[];
  activeDiscounts: any[];
  isLoading: boolean;
  error: string | null;
  fetchDiscounts: () => Promise<void>;
  fetchActiveDiscounts: () => Promise<void>;
  createDiscount: (discountData: any) => Promise<void>;
  updateDiscount: (id: number, discountData: any) => Promise<void>;
  deleteDiscount: (id: number) => Promise<void>;
}

export const useDiscountStore = create<DiscountState>((set, get) => ({
  discounts: [],
  activeDiscounts: [],
  isLoading: false,
  error: null,

  fetchDiscounts: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await discountApi.getAllDiscounts();
      set({ discounts: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch discounts' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActiveDiscounts: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await discountApi.getActiveDiscounts();
      set({ activeDiscounts: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch active discounts' });
    } finally {
      set({ isLoading: false });
    }
  },

  createDiscount: async (discountData) => {
    try {
      set({ isLoading: true, error: null });
      await discountApi.createDiscount(discountData);
      await get().fetchDiscounts();
      toast.success('Discount created successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to create discount' });
      toast.error('Failed to create discount');
    } finally {
      set({ isLoading: false });
    }
  },

  updateDiscount: async (id, discountData) => {
    try {
      set({ isLoading: true, error: null });
      await discountApi.updateDiscount(id, discountData);
      await get().fetchDiscounts();
      toast.success('Discount updated successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to update discount' });
      toast.error('Failed to update discount');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDiscount: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await discountApi.deleteDiscount(id);
      await get().fetchDiscounts();
      toast.success('Discount deleted successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete discount' });
      toast.error('Failed to delete discount');
    } finally {
      set({ isLoading: false });
    }
  },
})); 