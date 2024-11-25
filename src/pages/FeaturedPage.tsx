import React, { useState } from "react";
import { courses as allCourses } from "../data/courses";
import { CourseCard } from "../components/CourseCard";
import SortingComponent from "../components/SortingComponent";

export const FeaturedPage = () => {
  const [coursesState, setCoursesState] = useState(
    allCourses.filter((course) => course.featured)
  );
  const [selectedSort, setSelectedSort] = useState("Sort by");


  return (
    <div className="featured-page pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Featured Courses</h1>
  
      {/* Sorting Component */}
      <SortingComponent
        selectedSort={selectedSort}
        onSortChange={(sortOption) => {
          setSelectedSort(sortOption); // Seçilen sıralama seçeneğini güncelle
          const sortedCourses = [...coursesState].sort((a, b) =>
            sortOption === "lowToHigh" ? a.price - b.price : b.price - a.price
          );
          setCoursesState(sortedCourses); // Kursları sıralayıp güncelle
        }}
      />
  
      {/* Kursların listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {coursesState.length > 0 ? (
          coursesState.map((course) => (
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
}