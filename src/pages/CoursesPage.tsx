import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { CourseCard } from "../components/CourseCard";
import SortingComponent from '../components/SortingComponent';
import { productApi, ProductDto } from '../services/productApi';
import { toast } from 'react-hot-toast';

export const CoursesPage = () => {
  const [courses, setCourses] = useState<ProductDto[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ProductDto[]>([]);
  const [selectedSort, setSelectedSort] = useState('Sort by');
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchQuery && courses.length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = courses.filter(course => 
        course.name?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.instructorName?.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAllProducts();
      if (response.data) {
        setCourses(response.data);
        setFilteredCourses(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (sortOption: 'lowToHigh' | 'highToLow') => {
    setSelectedSort(sortOption);
    const sortedCourses = [...filteredCourses].sort((a, b) =>
      sortOption === 'lowToHigh' ? a.price - b.price : b.price - a.price
    );
    setFilteredCourses(sortedCourses);
  };

  if (isLoading) {
    return (
      <div className="courses-page pt-24 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Courses'}
      </h1>
      
      <SortingComponent
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              className="h-full"
            />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-600">
            {searchQuery ? 'No courses found matching your search' : 'No courses available'}
          </p>
        )}
      </div>
    </div>
  );
};
