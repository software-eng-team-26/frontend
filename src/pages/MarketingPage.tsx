import React, { useState} from "react";
import { courses as allCourses } from "../data/courses"; // Tüm kursları içeren veri
import { CourseCard } from "../components/CourseCard"; // Kurs kartı bileşeni
import  SortingComponent from '../components/SortingComponent';

export function MarketingPage() {
  const [coursesState, setCoursesState] = useState(
    allCourses.filter((course) => course.category === "marketing")
  );
  const [selectedSort, setSelectedSort] = useState("Sort by");
  

  return (
    <div className="pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Marketing Courses</h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 px-4">
        {coursesState.map((course) => (
          <CourseCard key={course.id} course={course} className="" />
        ))}
      </div>
    </div>
  );
}
