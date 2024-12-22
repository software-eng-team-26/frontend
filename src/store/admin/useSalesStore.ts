import { create } from 'zustand';
import { salesApi } from '../../services/admin/salesApi';

interface SalesState {
  sales: any[];
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    periodComparison: {
      revenue: number;
      orders: number;
      averageOrder: number;
    };
  } | null;
  revenueData: any[];
  isLoading: boolean;
  error: string | null;
  dateRange: {
    start: string;
    end: string;
  };
  fetchSales: (startDate?: string, endDate?: string) => Promise<void>;
  fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>;
  fetchRevenueData: (period: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  setDateRange: (start: string, end: string) => void;
}

export const useSalesStore = create<SalesState>((set) => ({
  sales: [],
  analytics: null,
  revenueData: [],
  isLoading: false,
  error: null,
  dateRange: {
    start: '',
    end: '',
  },

  fetchSales: async (startDate?: string, endDate?: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await salesApi.getSales(startDate, endDate);
      set({ sales: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch sales data' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await salesApi.getSalesAnalytics(startDate, endDate);
      set({ analytics: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch analytics' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRevenueData: async (period) => {
    try {
      set({ isLoading: true, error: null });
      const data = await salesApi.getRevenueByPeriod(period);
      set({ revenueData: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch revenue data' });
    } finally {
      set({ isLoading: false });
    }
  },

  setDateRange: (start, end) => set({ dateRange: { start, end } }),
})); 