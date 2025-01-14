import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/v1/products';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

export interface ProductFormData {
  name: string;
  brand: string;
  price: number;
  inventory: number;
  description: string;
  level: number;
  duration: number;
  moduleCount: number;
  certification: boolean;
  instructorName: string;
  instructorRole: string;
  thumbnailUrl: string;
  curriculum: string[];
  category: {
    id?: number;
    name: string;
  };
  featured?: boolean;
  averageRating?: number;
}

export const productManagementApi = {
  async getAllProducts() {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader());
    return response.data;
  },

  async addProduct(product: ProductFormData) {
    const transformedData = {
      ...product,
      featured: false,
      averageRating: 0,
      category: {
        name: product.category.name
      }
    };

    const response = await axios.post(
      `${API_URL}/add`, 
      transformedData, 
      getAuthHeader()
    );
    return response.data;
  },

  async updateProduct(productId: number, updates: Partial<ProductFormData>) {
    // For inventory updates, only send the inventory field
    const response = await axios.put(
      `${API_URL}/product/${productId}/update`,
      {
        inventory: updates.inventory
      },
      getAuthHeader()
    );
    return response.data;
  },

  async deleteProduct(productId: number) {
    try {
      const response = await axios.delete(
        `${API_URL}/product/${productId}/delete`,
        getAuthHeader()
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500 && 
          error.response?.data?.message?.includes('foreign key constraint')) {
        throw new Error('Cannot delete product because it is associated with a category');
      }
      throw error;
    }
  },

  async getProductById(productId: number) {
    const response = await axios.get(
      `${API_URL}/product/${productId}/product`,
      getAuthHeader()
    );
    return response.data;
  },

  async updateProductStock(productId: number, inventory: number) {
    const response = await axios.put(
      `${API_URL}/product/${productId}/stock`,
      { inventory },
      getAuthHeader()
    );
    return response.data;
  },

  async updateProductPrice(productId: number, price: number) {
    const response = await axios.put(
      `${API_URL}/product/${productId}/price`,
      { price },
      getAuthHeader()
    );
    return response.data;
  },
}; 