import React from 'react';
import { CategoryNav } from '../components/CategoryNav';
import { CourseCard } from '../components/CourseCard';
import { featuredCourses } from '../data/courses';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Featured Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
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