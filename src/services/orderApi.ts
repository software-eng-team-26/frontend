import { api } from './api';
import { ApiResponse } from '../types/api';
import { ShippingDetails, Order } from '../types/order';
import { useAuthStore } from '../store/useAuthStore';

interface OrderResponse {
  order: Order;
  redirectUrl: string;
}

export const orderApi = {
  createOrder: (shippingDetails: ShippingDetails) => {
    const token = useAuthStore.getState().getToken();
    return api.post<ApiResponse<OrderResponse>>('/orders/create', shippingDetails, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  completePayment: (orderId: number) => {
    return api.post<ApiResponse<Order>>(`/orders/${orderId}/complete-payment`);
  },

  getInvoice: (orderId: number) => {
    return api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
  },

  getOrder: (orderId: number) => {
    return api.get<ApiResponse<Order>>(`/orders/${orderId}`);
  },

  getUserOrders: () => {
    return api.get<ApiResponse<Order[]>>('/orders/my-orders');
  },

  getAllOrders: () => {
    const token = useAuthStore.getState().getToken();
    return api.get<ApiResponse<Order[]>>('/orders/admin/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  updateOrderStatus: (orderId: number, status: string) => {
    const token = useAuthStore.getState().getToken();
    return api.post<ApiResponse<Order>>(`/orders/${orderId}/update-status?status=${status}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}; 