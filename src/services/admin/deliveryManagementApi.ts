import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Order, OrderStatus } from '../../types/order';

const API_URL = 'http://localhost:9191/api/v1/orders';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${useAuthStore.getState().getToken()}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log('Interceptor received response:', response);
    return response; // Return the full response
  },
  error => {
    console.error('Interceptor caught error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
);

export const deliveryManagementApi = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/all', getAuthHeader());
      return response.data?.data || [];
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    try {
      const response = await api.put(
        `/${orderId}/status`,
        { status },
        getAuthHeader()
      );
      return response.data?.data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}; 