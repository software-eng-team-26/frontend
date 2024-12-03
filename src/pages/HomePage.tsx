import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryNav } from '../components/CategoryNav';
import { CourseCard } from '../components/CourseCard';
import { productApi, ProductDto } from '../services/productApi';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import { Slider } from '@mui/material';
import { SlidersHorizontal, Star, DollarSign } from 'lucide-react';

export function HomePage() {
  const [courses, setCourses] = useState<ProductDto[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUserStore();
  const { token } = useAuthStore();

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'rating'>('popularity');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, priceRange, minRating, sortBy]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAllProducts();
      if (response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Apply price filter
    filtered = filtered.filter(
      course => course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    // Apply rating filter
    filtered = filtered.filter(
      course => (course.averageRating || 0) >= minRating
    );

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* User Info Section */}
        {currentUser && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Welcome, {currentUser.firstName}!</h2>
            <div className="text-sm text-gray-600">
              <p>Email: {currentUser.email}</p>
              {token && (
                <p className="mt-1">
                  Session Active: <span className="text-green-600">✓</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center py-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Unlock Your Potential with Expert-Led Courses
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Learn from industry experts and transform your career with our
            comprehensive online courses.
          </p>
        </div>

        {/* Categories */}
        <CategoryNav />

        {/* Main Content with Filters */}
        <div className="flex gap-8 mt-12">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range
                  </h4>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Minimum Rating
                  </h4>
                  <Slider
                    value={minRating}
                    onChange={(_, newValue) => setMinRating(newValue as number)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.5}
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
              <p className="text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">Loading courses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-600 text-lg">
                      No courses match your filters
                    </p>
                    <button
                      onClick={() => {
                        setPriceRange([0, 1000]);
                        setMinRating(0);
                        setSortBy('popularity');
                      }}
                      className="mt-4 text-indigo-600 hover:text-indigo-800"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}