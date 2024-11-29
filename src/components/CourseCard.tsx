import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { ProductDto } from '../services/productApi';
import { cn } from '../lib/utils';

interface CourseCardProps {
  course: ProductDto;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(course);
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]',
      className
    )}>
      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <img
            src={course.thumbnailUrl}
            alt={course.name}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{course.instructorName}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${course.price}</span>
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