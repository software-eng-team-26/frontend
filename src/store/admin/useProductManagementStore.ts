import { create } from 'zustand';
import { productManagementApi, ProductFormData } from '../../services/admin/productManagementApi';
import { toast } from 'react-hot-toast';

interface ProductManagementState {
  products: any[];
  selectedProduct: any | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (productId: number, product: ProductFormData) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  setSelectedProduct: (product: any) => void;
  clearSelectedProduct: () => void;
}

export const useProductManagementStore = create<ProductManagementState>((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await productManagementApi.getAllProducts();
      set({ products: response.data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch products' });
      toast.error('Failed to fetch products');
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      await productManagementApi.addProduct(product);
      await get().fetchProducts();
      toast.success('Product added successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to add product' });
      toast.error('Failed to add product');
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (productId, product) => {
    try {
      set({ isLoading: true, error: null });
      await productManagementApi.updateProduct(productId, product);
      await get().fetchProducts();
      toast.success('Product updated successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to update product' });
      toast.error('Failed to update product');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      await productManagementApi.deleteProduct(productId);
      await get().fetchProducts();
      toast.success('Product deleted successfully');
    } catch (error: any) {
      if (error.response?.data?.message?.includes('foreign key constraint')) {
        toast.error('Cannot delete product because it is associated with a category. Please remove the category association first.');
      } else {
        set({ error: error.message || 'Failed to delete product' });
        toast.error('Failed to delete product');
      }
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
})); 