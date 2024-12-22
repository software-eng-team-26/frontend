import { create } from 'zustand';
import { stockManagementApi } from '../../services/admin/stockManagementApi';
import { Product } from '../../types/product';
import { toast } from 'react-hot-toast';

interface StockManagementState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  updateStock: (productId: number, newStock: number) => Promise<void>;
}

export const useStockManagementStore = create<StockManagementState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const products = await stockManagementApi.getAllProducts();
      console.log('Store received products:', products);
      
      if (!Array.isArray(products)) {
        console.error('Expected array of products but got:', products);
        set({ products: [] });
        return;
      }
      
      set({ products });
    } catch (error: any) {
      console.error('Store error:', error);
      set({ error: error.message || 'Failed to fetch products' });
      toast.error('Failed to fetch products');
    } finally {
      set({ isLoading: false });
    }
  },

  updateStock: async (productId, newStock) => {
    try {
      set({ isLoading: true, error: null });
      await stockManagementApi.updateStock(productId, newStock);
      await get().fetchProducts();
      toast.success('Stock updated successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to update stock' });
      toast.error('Failed to update stock');
    } finally {
      set({ isLoading: false });
    }
  }
})); 