import { api } from './api';
import { ApiResponse } from '../types/api';
import { ShippingDetails, Order, OrderItem } from '../types/order';
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

  updateOrderStatus: (orderId: number, status: OrderStatus) => {
    return api.post(`/orders/${orderId}/update-status?status=${status}`);
  },

  getRefundRequests: () => {
    const token = useAuthStore.getState().getToken();
    return api.get<ApiResponse<OrderItem[]>>('/orders/refund-requests', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  approveRefund: (orderId: number, itemId: number, approved: boolean) => {
    const token = useAuthStore.getState().getToken();
    return api.post<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items/${itemId}/refund/approve`, 
      null,
      {
        params: { approved },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  },

  requestRefund: async (orderId: number, itemId: number, reason: string) => {
    return await api.post(`/orders/${orderId}/items/${itemId}/refund`, {
      reason: reason
    });
  }
}; 