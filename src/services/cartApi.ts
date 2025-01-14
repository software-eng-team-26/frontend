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
    try {
      const response = await api.post<ApiResponse<Cart>>('/carts/add-item', null, {
        params: { productId, quantity }
      });
      return response;
    } catch (error) {
      console.error('Error in addItemToCart:', error);
      throw error;
    }
  },

  async removeItemFromCart(productId: number) {
    try {
      const currentCart = await this.getCurrentCart();
      if (!currentCart.data?.data?.id) {
        throw new Error('No active cart found');
      }
      const cartId = currentCart.data.data.id;
      
      return api.delete(`/carts/${cartId}/items/${productId}`);
    } catch (error) {
      console.error('Error in removeItemFromCart:', error);
      throw error;
    }
  },

  async clearCart() {
    const response = await api.delete<ApiResponse<null>>('/carts/clear');
    return response;
  }
}; 