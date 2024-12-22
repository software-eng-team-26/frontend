import { create } from 'zustand';
import { commentManagementApi, Comment } from '../../services/admin/commentManagementApi';
import { toast } from 'react-hot-toast';

interface CommentManagementState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  fetchComments: () => Promise<void>;
  approveComment: (id: number) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
}

export const useCommentManagementStore = create<CommentManagementState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchComments: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await commentManagementApi.getAllComments();
      set({ comments: response.data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch comments' });
      toast.error('Failed to fetch comments');
    } finally {
      set({ isLoading: false });
    }
  },

  approveComment: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await commentManagementApi.approveComment(id);
      await get().fetchComments();
      toast.success('Comment approved successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to approve comment' });
      toast.error('Failed to approve comment');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteComment: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await commentManagementApi.deleteComment(id);
      await get().fetchComments();
      toast.success('Comment deleted successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete comment' });
      toast.error('Failed to delete comment');
    } finally {
      set({ isLoading: false });
    }
  }
})); 