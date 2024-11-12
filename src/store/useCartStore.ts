import { create } from 'zustand';
import { Course } from '../types/course';

interface CartItem {
  course: Course;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (course: Course) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (course) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.course.id === course.id
      );
      if (existingItem) {
        return state;
      }
      return { items: [...state.items, { course, quantity: 1 }] };
    });
  },
  removeItem: (courseId) => {
    set((state) => ({
      items: state.items.filter((item) => item.course.id !== courseId),
    }));
  },
  clearCart: () => set({ items: [] }),
  get total() {
    return get().items.reduce((sum, item) => sum + item.course.price, 0);
  },
}));