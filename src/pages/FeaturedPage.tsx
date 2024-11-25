import React from "react";
import { courses } from "../data/courses";
import { CourseCard } from "../components/CourseCard";

export const FeaturedPage = () => {
  const featuredCourses = courses.filter((course) => course.featured);

  return (
    <div className="featured-page pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Featured Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4">
        {featuredCourses.length > 0 ? (
          featuredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              className="h-full"
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No featured courses available.</p>
        )}
      </div>
    </div>
  );
};
