import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, BookOpen, BarChart2, Award } from 'lucide-react';
import { courses } from '../data/courses';
import { useCartStore } from '../store/useCartStore';

export function CoursePage() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const addItem = useCartStore((state) => state.addItem);

  if (!course) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {course.category}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">12 Modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart2 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Certificate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Lifetime Access</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What you'll learn
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Build real-world projects',
                    'Master industry best practices',
                    'Get personalized feedback',
                    'Join a community of learners',
                    'Access exclusive resources',
                    'Earn a verified certificate',
                  ].map((item) => (
                    <li key={item} className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Course Curriculum
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((module) => (
                  <div
                    key={module}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-medium text-gray-900">
                      Module {module}: Introduction
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      4 lessons • 45 minutes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${course.price}
                </span>
              </div>
              <button
                onClick={() => addItem(course)}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
              >
                Add to Cart
              </button>
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Instructor</h4>
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      course.instructor
                    )}&background=random`}
                    alt={course.instructor}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {course.instructor}
                    </p>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}