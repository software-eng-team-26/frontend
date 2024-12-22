import { create } from 'zustand';
import { stockApi } from '../../services/admin/stockApi';
import { toast } from 'react-hot-toast';

interface StockState {
  items: any[];
  lowStockItems: any[];
  selectedItem: any | null;
  isLoading: boolean;
  error: string | null;
  fetchAllStock: () => Promise<void>;
  fetchLowStockItems: () => Promise<void>;
  adjustStock: (adjustment: {
    productId: number;
    quantity: number;
    type: 'increase' | 'decrease';
    reason: string;
  }) => Promise<void>;
  setStockLevels: (productId: number, min: number, max: number) => Promise<void>;
  selectItem: (item: any) => void;
  clearSelectedItem: () => void;
}

export const useStockStore = create<StockState>((set, get) => ({
  items: [],
  lowStockItems: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchAllStock: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await stockApi.getAllStock();
      set({ items: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch stock items' });
      toast.error('Failed to fetch stock items');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLowStockItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await stockApi.getLowStockItems();
      set({ lowStockItems: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch low stock items' });
      toast.error('Failed to fetch low stock items');
    } finally {
      set({ isLoading: false });
    }
  },

  adjustStock: async (adjustment) => {
    try {
      set({ isLoading: true, error: null });
      await stockApi.adjustStock(adjustment);
      await get().fetchAllStock();
      toast.success('Stock adjusted successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to adjust stock' });
      toast.error('Failed to adjust stock');
    } finally {
      set({ isLoading: false });
    }
  },

  setStockLevels: async (productId, min, max) => {
    try {
      set({ isLoading: true, error: null });
      await stockApi.setStockLevels(productId, min, max);
      await get().fetchAllStock();
      toast.success('Stock levels updated successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to update stock levels' });
      toast.error('Failed to update stock levels');
    } finally {
      set({ isLoading: false });
    }
  },

  selectItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
})); 