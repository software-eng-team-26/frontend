import React, { useState, useEffect } from "react";
import { CourseCard } from "../components/CourseCard";
import SortingComponent from '../components/SortingComponent';
import { productApi, ProductDto } from '../services/productApi';
import { toast } from 'react-hot-toast';

export const FeaturedPage = () => {
  const [courses, setCourses] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("Sort by");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await productApi.getAllProducts();
      if (response.data) {
        const featuredCourses = response.data.filter(course => course.featured); // sadece featured olanları al
        setCourses(featuredCourses); // filtered datayı state'e ata
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
    const sortedCourses = [...courses].sort((a, b) =>
      sortOption === "lowToHigh" ? a.price - b.price : b.price - a.price
    );
    setCourses(sortedCourses);
  };

  if (isLoading) {
    return (
      <div className="pt-24 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Featured Courses</h1>

      <SortingComponent
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-600">
            No courses available
          </p>
        )}
      </div>
    </div>
  );
};