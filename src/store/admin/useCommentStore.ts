import { create } from 'zustand';
import { commentApi } from '../../services/admin/commentApi';
import { toast } from 'react-hot-toast';

interface CommentState {
  comments: any[];
  pendingComments: any[];
  selectedComment: any | null;
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'approved' | 'rejected';
  fetchComments: () => Promise<void>;
  fetchPendingComments: () => Promise<void>;
  approveComment: (id: number) => Promise<void>;
  rejectComment: (id: number) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
  selectComment: (comment: any) => void;
  clearSelectedComment: () => void;
  setFilter: (filter: CommentState['filter']) => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  pendingComments: [],
  selectedComment: null,
  isLoading: false,
  error: null,
  filter: 'all',

  fetchComments: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await commentApi.getAllComments();
      set({ comments: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch comments' });
      toast.error('Failed to fetch comments');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPendingComments: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await commentApi.getPendingComments();
      set({ pendingComments: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch pending comments' });
      toast.error('Failed to fetch pending comments');
    } finally {
      set({ isLoading: false });
    }
  },

  approveComment: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await commentApi.approveComment(id);
      await get().fetchComments();
      toast.success('Comment approved successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to approve comment' });
      toast.error('Failed to approve comment');
    } finally {
      set({ isLoading: false });
    }
  },

  rejectComment: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await commentApi.rejectComment(id);
      await get().fetchComments();
      toast.success('Comment rejected successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to reject comment' });
      toast.error('Failed to reject comment');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteComment: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await commentApi.deleteComment(id);
      await get().fetchComments();
      toast.success('Comment deleted successfully');
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete comment' });
      toast.error('Failed to delete comment');
    } finally {
      set({ isLoading: false });
    }
  },

  selectComment: (comment) => set({ selectedComment: comment }),
  clearSelectedComment: () => set({ selectedComment: null }),
  setFilter: (filter) => set({ filter }),
})); 