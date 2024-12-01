import { api } from './api';
import { ProductDto } from './productApi';

export interface CartItem {
  id: number;
  product: ProductDto;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: number | null;
  items: CartItem[];
  totalAmount: number;
  user?: {
    id: number;
    email: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export const cartApi = {
  async getCurrentCart() {
    try {
      const response = await api.get<ApiResponse<Cart>>('/carts/my-cart');
      console.log('Cart API response:', response.data);
      return response;
    } catch (error) {
      console.error('Cart API error:', error);
      throw error;
    }
  },

  async addItemToCart(productId: number, quantity: number = 1) {
    const response = await api.post<ApiResponse<Cart>>('/carts/add-item', null, {
      params: { productId, quantity }
    });
    return response;
  },

  async removeItemFromCart(cartId: number, productId: number) {
    if (!cartId) {
      throw new Error('Cart ID is required');
    }
    return api.delete(`/carts/${cartId}/items/${productId}`);
  },

  async clearCart() {
    const response = await api.delete<ApiResponse<null>>('/carts/clear');
    return response;
  }
}; 