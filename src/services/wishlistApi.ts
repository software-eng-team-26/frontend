import axios from 'axios';
import { ProductDto } from './productApi';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/wishlist';

const getAuthHeader = () => {
  const token = useAuthStore.getState().getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

interface WishlistResponse {
  id: number;
  userId: number;
  products: ProductDto[];
}

export const getWishlist = async (userId: number): Promise<WishlistResponse> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (userId: number, productId: number): Promise<WishlistResponse> => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/add/${productId}`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (userId: number, productId: number): Promise<WishlistResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}/remove/${productId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};