import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/admin';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

interface SalesData {
  id: string;
  date: string;
  amount: number;
  customerName: string;
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  periodComparison: {
    revenue: number;
    orders: number;
    averageOrder: number;
  };
}

export const salesApi = {
  async getSales(startDate?: string, endDate?: string) {
    const response = await axios.get(
      `${API_URL}/sales`,
      {
        params: { startDate, endDate },
        ...getAuthHeader()
      }
    );
    return response.data;
  },

  async getSalesAnalytics(startDate?: string, endDate?: string): Promise<SalesAnalytics> {
    const response = await axios.get(
      `${API_URL}/sales/analytics`,
      {
        params: { startDate, endDate },
        ...getAuthHeader()
      }
    );
    return response.data;
  },

  async getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly') {
    const response = await axios.get(
      `${API_URL}/sales/revenue/${period}`,
      getAuthHeader()
    );
    return response.data;
  }
}; 