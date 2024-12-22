import { create } from 'zustand';
import { salesManagementApi } from '../../services/admin/salesManagementApi';
import { Product } from '../../types/product';
import { toast } from 'react-hot-toast';

interface SalesManagementState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  updatePrice: (productId: number, newPrice: number) => Promise<void>;
}

export const useSalesManagementStore = create<SalesManagementState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Store: Fetching products');
      const products = await salesManagementApi.getAllProducts();
      console.log('Store: Received products:', products);
      set({ products });
    } catch (error: any) {
      console.error('Store: Error fetching products:', error);
      set({ error: error.message || 'Failed to fetch products' });
      toast.error('Failed to fetch products');
    } finally {
      set({ isLoading: false });
    }
  },

  updatePrice: async (productId, newPrice) => {
    try {
      set({ isLoading: true, error: null });
      await salesManagementApi.updatePrice(productId, newPrice);
      await salesManagementApi.getAllProducts().then(products => set({ products }));
      toast.success('Price updated successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to update price' });
      toast.error('Failed to update price');
    } finally {
      set({ isLoading: false });
    }
  }
})); 