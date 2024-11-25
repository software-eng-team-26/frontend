import { ApiResponse } from './api';

export type OrderStatus = 'processing' | 'in-transit' | 'delivered';

export interface OrderItem {
  courseId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191/api/v1';

export const orderApi = {
  async createOrder(cartId: number): Promise<ApiResponse<Order>> {
    // TODO: Replace with actual backend call
    // POST /api/v1/orders
    // Payload: { cartId }
    // Returns: Order object with initial status 'processing'
    
    const mockOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 1,
      items: [],
      totalAmount: 0,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      message: 'Order created successfully',
      data: mockOrder
    };
  },

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    // TODO: Replace with actual backend call
    // GET /api/v1/orders/{orderId}
    // Returns: Order object with current status
    
    const mockOrder: Order = {
      id: orderId,
      userId: 1,
      items: [],
      totalAmount: 0,
      status: 'in-transit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      message: 'Order retrieved successfully',
      data: mockOrder
    };
  },

  async getUserOrders(userId: number): Promise<ApiResponse<Order[]>> {
    // TODO: Replace with actual backend call
    // GET /api/v1/users/{userId}/orders
    // Returns: Array of Order objects
    
    const mockOrders: Order[] = [
      {
        id: '1',
        userId,
        items: [],
        totalAmount: 99.99,
        status: 'delivered',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId,
        items: [],
        totalAmount: 149.99,
        status: 'in-transit',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    return {
      message: 'Orders retrieved successfully',
      data: mockOrders
    };
  },
}; 