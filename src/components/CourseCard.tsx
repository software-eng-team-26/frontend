import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import { Course } from '../types/course';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/useCartStore';

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addItem(course);
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]',
        className
      )}
    >
      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          {course.isNew && (
            <span className="absolute top-4 right-4 bg-indigo-600 text-white px-2 py-1 text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {course.featured && (
            <span className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
              FEATURED
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {course.category}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {course.level}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.instructor}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${course.price}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}