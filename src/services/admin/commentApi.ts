import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/admin/comments';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

interface Comment {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const commentApi = {
  async getAllComments() {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  async approveComment(id: number) {
    const response = await axios.put(
      `${API_URL}/${id}/approve`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async rejectComment(id: number) {
    const response = await axios.put(
      `${API_URL}/${id}/reject`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async getPendingComments() {
    const response = await axios.get(`${API_URL}/pending`, getAuthHeader());
    return response.data;
  },

  async deleteComment(id: number) {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  }
}; 