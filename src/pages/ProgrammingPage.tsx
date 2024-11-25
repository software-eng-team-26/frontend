import React from "react";
import { courses } from "../data/courses"; // Tüm kursları içeren veri
import { CourseCard } from "../components/CourseCard"; // Kurs kartı bileşeni

export function ProgrammingPage() {
  const programmingCourses = courses.filter(
    (course) => course.category === "programming"
  );

  return (
    <div className="pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Programming Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4">
        {programmingCourses.map((course) => (
          <CourseCard key={course.id} course={course} className="" />
        ))}
      </div>
    </div>
  );
}
