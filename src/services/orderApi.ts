import { api } from './api';
import { ApiResponse } from '../types/api';
import { ShippingDetails, Order } from '../types/order';

interface OrderResponse {
  order: Order;
  redirectUrl: string;
}

export const orderApi = {
  createOrder: (shippingDetails: ShippingDetails) => {
    return api.post<ApiResponse<OrderResponse>>('/orders/create', shippingDetails);
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
    return api.get<ApiResponse<any>>(`/orders/${orderId}`);
  },

  getUserOrders: () => {
    return api.get<ApiResponse<any>>('/orders/my-orders');
  }
}; 