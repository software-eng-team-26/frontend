import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryNav } from '../components/CategoryNav';
import { CourseCard } from '../components/CourseCard';
import { productApi, ProductDto } from '../services/productApi';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

export function HomePage() {
  console.log('HomePage component rendering');
  const [courses, setCourses] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUserStore();
  const { token } = useAuthStore();

  useEffect(() => {
    console.log('HomePage useEffect running');
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching courses...');
      const response = await productApi.getAllProducts();
      console.log('Courses response:', response);
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

        {/* All Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
            <Link 
              to="/courses" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-600">
                  No courses available
                </p>
              )}
            </div>
          )}
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose EduMart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Instructors',
                description:
                  'Learn from industry professionals with years of experience',
              },
              {
                title: 'Flexible Learning',
                description:
                  'Study at your own pace with lifetime access to courses',
              },
              {
                title: 'Career-Focused Content',
                description:
                  "Gain practical skills that are relevant in today's job market",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-lg bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}