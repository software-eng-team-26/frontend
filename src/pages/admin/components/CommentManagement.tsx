import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useCommentManagementStore } from '../../../store/admin/useCommentManagementStore';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

const getCommentStatus = (approved: any) => {
  // Check if approved is 1, true, '0x01', or any truthy binary value
  return approved === 1 || approved === true || approved === '0x01' || approved > 0 
    ? 'approved' 
    : 'pending';
};

export function CommentManagement() {
  const { 
    comments, 
    isLoading, 
    error,
    fetchComments,
    approveComment,
    deleteComment 
  } = useCommentManagementStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const filteredComments = comments
    .filter(comment => comment.content)
    .filter(comment => {
      const matchesSearch = 
        (comment.content?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (comment.productName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (comment.userName?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      const status = getCommentStatus(comment.approved);
      if (filter === 'all') return matchesSearch;
      return matchesSearch && status === filter;
    });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        await deleteComment(id);
        const updatedComments = comments.filter(comment => comment.id !== id);
        useCommentManagementStore.setState({ comments: updatedComments });
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveComment(id);
      const updatedComments = comments.map(comment => 
        comment.id === id 
          ? { ...comment, approved: true }
          : comment
      );
      useCommentManagementStore.setState({ comments: updatedComments });
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews & Ratings</h1>

      {/* Search and Filter */}
      <div className="flex justify-between mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Entries</option>
          <option value="pending">Pending Reviews</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredComments.map((comment) => {
              const status = getCommentStatus(comment.approved);
              
              return (
                <tr key={comment.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{comment.userName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{comment.productName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{comment.content}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{comment.rating}</span>
                      <span className="text-gray-500">/5</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${getStatusBadgeColor(status)}`}
                    >
                      {status === 'pending' ? 'Waiting Approval' : 'Approved'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {status === 'pending' ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                          title="Approve Review"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="ml-1 text-xs">Approve</span>
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Delete Review"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="ml-1 text-xs">Delete</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Delete Review"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="ml-1 text-xs">Delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 