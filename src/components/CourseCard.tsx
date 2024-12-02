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
  const navigate = useNavigate();

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

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]',
      className
    )}>
      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <img
            src={course.thumbnail || course.imageUrl}
            alt={course.title || course.name}
            className="w-full h-48 object-cover"
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