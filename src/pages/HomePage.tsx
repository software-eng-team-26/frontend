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
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Welcome back, {currentUser.firstName}! 👋</h2>
            <div className="text-sm text-gray-600 flex items-center space-x-4">
              <p className="bg-gray-50 px-3 py-1 rounded-full">{currentUser.email}</p>
              {token && (
                <p className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Active Session
                </p>
              )}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative overflow-hidden py-20 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl mb-12 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto text-center">
              Transform Your Future with Expert-Led Online Learning
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto text-center mb-8">
              Join thousands of learners worldwide and master the skills that matter in today's digital world.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/courses" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
                Explore Courses
              </Link>
              <Link to="/featured" className="bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg">
                View Featured
              </Link>
            </div>
          </div>
        </div>

        {/* Categories */}
        <CategoryNav />

        {/* All Courses */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Courses</h2>
            <Link 
              to="/courses" 
              className="group flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-600 py-12 bg-white rounded-lg">
                  No courses available at the moment
                </p>
              )}
            </div>
          )}
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-3xl p-12 mb-12 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose EduMart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience',
                icon: (
                  <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ),
              },
              {
                title: 'Flexible Learning',
                description: 'Study at your own pace with lifetime access to all course content',
                icon: (
                  <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Career-Focused Content',
                description: 'Gain practical skills that employers are actively seeking',
                icon: (
                  <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300 hover:shadow-md"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}