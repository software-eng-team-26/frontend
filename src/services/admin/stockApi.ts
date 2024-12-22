import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/admin/stock';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

interface StockItem {
  id: number;
  productId: number;
  productName: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  lastUpdated: string;
}

interface StockAdjustment {
  productId: number;
  quantity: number;
  type: 'increase' | 'decrease';
  reason: string;
}

export const stockApi = {
  async getAllStock() {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  async adjustStock(adjustment: StockAdjustment) {
    const response = await axios.post(
      `${API_URL}/adjust`,
      adjustment,
      getAuthHeader()
    );
    return response.data;
  },

  async getLowStockItems() {
    const response = await axios.get(`${API_URL}/low-stock`, getAuthHeader());
    return response.data;
  },

  async getStockHistory(productId: number) {
    const response = await axios.get(
      `${API_URL}/history/${productId}`,
      getAuthHeader()
    );
    return response.data;
  },

  async setStockLevels(productId: number, min: number, max: number) {
    const response = await axios.put(
      `${API_URL}/levels/${productId}`,
      { minLevel: min, maxLevel: max },
      getAuthHeader()
    );
    return response.data;
  }
}; 