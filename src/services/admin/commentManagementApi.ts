import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = 'http://localhost:9191/api/v1/comments';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().getToken()}`
  }
});

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  content: string;
  rating: number;
  approved: number;
  createdAt: string;
}

export const getCommentStatus = (approved: number): 'pending' | 'approved' => {
  return approved === 0x01 ? 'approved' : 'pending';
};

export const commentManagementApi = {
  async getAllComments() {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader());
    const comments = response.data.data.map((comment: Comment) => ({
      ...comment,
      status: getCommentStatus(comment.approved)
    }));
    return { ...response.data, data: comments };
  },

  async approveComment(id: number) {
    const response = await axios.put(
      `${API_URL}/approve/${id}`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async deleteComment(id: number) {
    const response = await axios.delete(
      `${API_URL}/delete/${id}`,
      getAuthHeader()
    );
    return response.data;
  }
}; 