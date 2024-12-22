import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/v1/categories';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const categoryManagementApi = {
  async getAllCategories() {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader());
    return response.data;
  },

  async addCategory(category: { name: string; description: string }) {
    const response = await axios.post(`${API_URL}/add`, category, getAuthHeader());
    return response.data;
  },

  async updateCategory(id: number, category: { name: string; description: string }) {
    const response = await axios.put(
      `${API_URL}/category/${id}/update`,
      category,
      getAuthHeader()
    );
    return response.data;
  },

  async deleteCategory(id: number) {
    const response = await axios.delete(
      `${API_URL}/category/${id}/delete`,
      getAuthHeader()
    );
    return response.data;
  }
}; 