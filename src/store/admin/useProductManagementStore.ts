import { create } from 'zustand';
import { productManagementApi, ProductFormData } from '../../services/admin/productManagementApi';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../useAuthStore';

interface ProductManagementState {
  products: any[];
  selectedProduct: any | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (productId: number, product: Partial<ProductFormData>) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  setSelectedProduct: (product: any) => void;
  clearSelectedProduct: () => void;
  updateProductStock: (productId: number, inventory: number) => Promise<void>;
  updateProductPrice: (productId: number, price: number) => Promise<void>;
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
      if (error.response?.status === 401) {
        useAuthStore.getState().clearToken();
        toast.error('Your session has expired. Please sign in again.');
      } else {
        set({ error: error.message || 'Failed to fetch products' });
        toast.error('Failed to fetch products');
      }
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
      if (error.response?.status === 401) {
        useAuthStore.getState().clearToken();
        toast.error('Your session has expired. Please sign in again.');
      } else {
        set({ error: error.message || 'Failed to add product' });
        toast.error('Failed to add product');
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (productId, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current product from local state
      const currentProduct = get().products.find(p => p.id === productId);
      if (!currentProduct) {
        throw new Error('Product not found');
      }

      const updatedProduct = await productManagementApi.updateProduct(productId, updates);
      
      // Update the local state while preserving all existing product data
      set(state => ({
        products: state.products.map(product => 
          product.id === productId 
            ? {
                ...currentProduct, // Keep all existing product data
                inventory: updatedProduct.inventory // Only update inventory
              }
            : product
        )
      }));
      
      toast.success('Product updated successfully');
    } catch (error: any) {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearToken();
        toast.error('Your session has expired. Please sign in again.');
      } else {
        set({ error: error.message || 'Failed to update product' });
        toast.error('Failed to update product');
      }
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
      if (error.response?.status === 401) {
        useAuthStore.getState().clearToken();
        toast.error('Your session has expired. Please sign in again.');
      } else if (error.response?.data?.message?.includes('foreign key constraint')) {
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

  updateProductStock: async (productId: number, inventory: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProduct = await productManagementApi.updateProductStock(productId, inventory);
      
      set(state => ({
        products: state.products.map(product => 
          product.id === productId 
            ? { ...product, inventory: updatedProduct.inventory }
            : product
        )
      }));
      
      toast.success('Stock updated successfully');
    } catch (error: any) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProductPrice: async (productId: number, price: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProduct = await productManagementApi.updateProductPrice(productId, price);
      
      set(state => ({
        products: state.products.map(product => 
          product.id === productId 
            ? { ...product, price: updatedProduct.price }
            : product
        )
      }));
      
      toast.success('Price updated successfully');
    } catch (error: any) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },
})); 