import { ApiResponse } from './api';

export interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  title: string;
  thumbnail: string;
}

export interface Cart {
  id: number;
  totalAmount: number;
  items: CartItem[];
  userId: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191/api/v1';

export const cartApi = {
  async getCart(cartId: number): Promise<ApiResponse<Cart>> {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/my-cart`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async clearCart(cartId: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/clear`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getTotalAmount(cartId: number): Promise<ApiResponse<number>> {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/cart/total-price`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
}; 