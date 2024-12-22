import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { CourseCard } from '../components/CourseCard';
import { toast } from 'react-hot-toast';

export function WishlistPage() {
  const { items, isLoading, error, fetchWishlist } = useWishlistStore();
  const { user } = useUserStore();
  const { getToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token || !user?.id) {
      toast.error('Please sign in to view your wishlist');
      navigate('/signin', {
        state: {
          from: '/wishlist',
          message: 'Please sign in to view your wishlist'
        }
      });
      return;
    }

    fetchWishlist(user.id).catch((error) => {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    });
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          {items.length > 0 && (
            <span className="text-gray-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
            <button
              onClick={() => navigate('/courses')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 