import React, { useEffect, useState } from 'react';
import { useCourse } from '../hooks/useCourse';
import { CourseCard } from '../components/CourseCard';

export function Courses() {
  const { courses, loading, fetchCourses } = useCourse();
  const [filters, setFilters] = useState({
    category: '',
    level: ''
  });

  useEffect(() => {
    fetchCourses(filters);
  }, [filters.category, filters.level, fetchCourses]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">All Courses</h1>
        <p className="text-gray-600 mb-8">Choose from our extensive library of educational content</p>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <input
              type="text"
              placeholder="Filter by category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl">⏳</div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No courses found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEnroll={(courseId) => {
                      // TODO: Implement enrollment with auth check
                      console.log('Enrolling in course:', courseId);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
