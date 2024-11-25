import React from "react";
import { courses } from "../data/courses"; // Tüm kurs verileri
import { CourseCard } from "../components/CourseCard"; // CourseCard bileşeni

export const CoursesPage = () => {
  return (
    <div className="courses-page pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">All Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};
