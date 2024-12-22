import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ProductDto } from '../services/productApi';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';

interface CourseCardProps {
  course: ProductDto;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const { addItem } = useCartStore();
  const { user } = useUserStore();
  const { getToken } = useAuthStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const isInWishlist = wishlistItems.some(item => item.id === course.id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const token = getToken();
    console.log('Current token:', token);
    console.log('Current user:', user);
    
    if (!token || !user?.id) {
      toast.error('Please sign in to use wishlist');
      navigate('/signin', { 
        state: { 
          from: window.location.pathname,
          message: 'Please sign in to add items to your wishlist'
        } 
      });
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(user.id, course.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(user.id, course.id);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      console.error('Wishlist operation failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(errorMessage);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      await addItem(course);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Helper function to get the correct image URL
  const getImageUrl = (course: ProductDto) => {
    // Check all possible image URL properties and return the first valid one
    return course.thumbnail || 
           course.thumbnailUrl || 
           course.imageUrl || 
           '/default-course-image.jpg'; // Provide a default image as fallback
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] relative',
      className
    )}>
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-colors",
            isInWishlist 
              ? "fill-red-500 stroke-red-500" 
              : "stroke-gray-600 hover:stroke-red-500"
          )} 
        />
      </button>

      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <img
            src={getImageUrl(course)}
            alt={course.title || course.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/default-course-image.jpg';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{course.title || course.name}</h3>
          {course.instructor && (
            <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold text-gray-900">${course.price.toFixed(2)}</span>
            <span className={cn(
              "text-sm",
              course.inventory > 0 ? "text-gray-500" : "text-red-500 font-medium"
            )}>
              {course.inventory > 0 ? `${course.inventory} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={handleAddToCart}
              disabled={course.inventory <= 0}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                course.inventory > 0 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {course.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}