import { ApiResponse } from './api';
import { Comment } from '../types/comment';

interface CommentDto {
  productId: number;
  userId: number;
  content: string;
  rating: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191/api/v1';

export const commentApi = {
  async addComment(comment: CommentDto): Promise<ApiResponse<Comment>> {
    const response = await fetch(`${API_BASE_URL}/comments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getApprovedComments(productId: number): Promise<ApiResponse<Comment[]>> {
    const response = await fetch(`${API_BASE_URL}/comments/approved/${productId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}; 