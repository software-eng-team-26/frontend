import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Product } from '../../types/product';

const API_URL = 'http://localhost:9191/api/v1/products';

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

api.interceptors.response.use(
  response => {
    console.log('Product API Response:', response);
    return response;
  },
  error => {
    console.error('Product API Error:', error.response?.data || error);
    throw error;
  }
);

export const stockManagementApi = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/all', getAuthHeader());
      const products = response.data?.data || [];
      
      return products.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        inventory: product.inventory,
        category: {
          id: product.category?.id || 0,
          name: product.category?.name || ''
        },
        imageUrl: product.imageUrl
      }));
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async updateStock(productId: number, newStock: number): Promise<Product> {
    try {
      const response = await api.put(
        `/update/${productId}`,
        { inventory: newStock },
        getAuthHeader()
      );
      
      const product = response.data?.data;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        inventory: product.inventory,
        category: {
          id: product.category?.id || 0,
          name: product.category?.name || ''
        },
        imageUrl: product.imageUrl
      };
    } catch (error: any) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
}; 