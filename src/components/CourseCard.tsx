import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProductDto } from '../services/productApi';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface CourseCardProps {
  course: ProductDto;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const { addItem } = useCartStore();
  const { currentUser } = useUserStore();
  const { getToken } = useAuthStore();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const currentToken = getToken();
    const backupToken = localStorage.getItem('jwt_token');
    
    console.log('Auth state:', { 
      currentUser, 
      token: currentToken,
      backupToken,
      hasToken: !!(currentToken || backupToken)
    });
    
    if (!currentUser || !(currentToken || backupToken)) {
      toast.error('Please sign in to add items to cart');
      navigate('/signin');
      return;
    }

    try {
      await addItem(course);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          useAuthStore.getState().clearToken();
          toast.error('Session expired. Please sign in again.');
          navigate('/signin');
        } else {
          toast.error('Failed to add item to cart');
        }
      }
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]',
      className
    )}>
      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold text-gray-900">${course.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">
              {course.inventory > 0 ? `${course.inventory} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}