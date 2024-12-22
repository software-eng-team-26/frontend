import { create } from 'zustand';
import { categoryManagementApi, Category } from '../../services/admin/categoryManagementApi';
import { toast } from 'react-hot-toast';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: number, category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await categoryManagementApi.getAllCategories();
      set({ categories: response.data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories' });
      toast.error('Failed to fetch categories');
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      await categoryManagementApi.addCategory(category);
      await get().fetchCategories();
      toast.success('Category added successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to add category' });
      toast.error('Failed to add category');
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, category) => {
    try {
      set({ isLoading: true, error: null });
      await categoryManagementApi.updateCategory(id, category);
      await get().fetchCategories();
      toast.success('Category updated successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to update category' });
      toast.error('Failed to update category');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await categoryManagementApi.deleteCategory(id);
      await get().fetchCategories();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete category' });
      toast.error('Failed to delete category');
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category })
})); 