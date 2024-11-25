import React, { useState } from "react";
import { courses } from "../data/courses"; // Tüm kurs verileri
import { CourseCard } from "../components/CourseCard"; // CourseCard bileşeni
import  SortingComponent from '../components/SortingComponent';

export const CoursesPage = () => {

  const [coursesState, setCoursesState] = useState(courses); // Kurslar
  const [selectedSort, setSelectedSort] = useState('Sort by'); // Seçili sıralama seçeneği

 
  
  return (
    <div className="courses-page pt-24 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">All Courses</h1>
      
      {/* SortingComponent */}
      <SortingComponent
        selectedSort={selectedSort}
        onSortChange={(sortOption) => {
          setSelectedSort(sortOption); // Seçimi güncelle
          const sortedCourses = [...courses].sort((a, b) =>
            sortOption === 'lowToHigh' ? a.price - b.price : b.price - a.price
          );
          setCoursesState(sortedCourses); // Kursları sıralayıp güncelle
        }}
      />
    
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coursesState.map((course) => (
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
