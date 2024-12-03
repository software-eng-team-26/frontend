import { api } from './api';

export interface Comment {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  content: string;
  rating: number;
  createdAt: string;
  approved: boolean;
}

export interface CommentRequest {
  productId: number;
  userId: number;
  content: string;
  rating?: number | null;
}

export interface RatingRequest {
  productId: number;
  rating: number;
}

export const commentApi = {
  getApprovedComments: async (productId: number) => {
    return api.get<Comment[]>(`/comments/approved/${productId}`);
  },

  addRating: async (ratingData: RatingRequest) => {
    return api.post<void>('/comments/rating', ratingData);
  },

  addComment: async (commentData: CommentRequest) => {
    return api.post<Comment>('/comments/add', commentData);
  },
}; 