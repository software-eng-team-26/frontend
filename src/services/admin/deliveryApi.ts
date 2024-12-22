import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/admin/delivery';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

interface DeliveryItem {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  address: string;
  products: {
    id: number;
    name: string;
    quantity: number;
  }[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const deliveryApi = {
  async getAllDeliveries() {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  async getDeliveryById(id: string) {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },

  async updateDeliveryStatus(id: string, status: DeliveryItem['status']) {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      getAuthHeader()
    );
    return response.data;
  },

  async getPendingDeliveries() {
    const response = await axios.get(`${API_URL}/pending`, getAuthHeader());
    return response.data;
  },

  async getCompletedDeliveries() {
    const response = await axios.get(`${API_URL}/completed`, getAuthHeader());
    return response.data;
  }
}; 