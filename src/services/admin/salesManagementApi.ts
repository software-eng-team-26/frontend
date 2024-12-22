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

export const salesManagementApi = {
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Making API request to fetch products');
      const response = await api.get('/all', getAuthHeader());
      console.log('API Response:', response.data);

      const products = response.data?.data || [];
      console.log('Extracted products:', products);

      return products.map((product: any) => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: parseFloat(product.price) || 0,
        inventory: parseInt(product.inventory) || 0,
        category: {
          id: product.category?.id || 0,
          name: product.category?.name || 'Uncategorized'
        },
        imageUrl: product.imageUrl || null
      }));
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async updatePrice(productId: number, newPrice: number): Promise<Product> {
    try {
      console.log('Updating price:', { productId, newPrice });
      const response = await api.put(
        `/update/${productId}`,
        { price: newPrice },
        getAuthHeader()
      );
      console.log('Update response:', response.data);

      const product = response.data?.data;
      return {
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: parseFloat(product.price) || 0,
        inventory: parseInt(product.inventory) || 0,
        category: {
          id: product.category?.id || 0,
          name: product.category?.name || 'Uncategorized'
        },
        imageUrl: product.imageUrl || null
      };
    } catch (error: any) {
      console.error('Error updating price:', error);
      throw error;
    }
  }
}; 