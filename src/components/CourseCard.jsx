import React from 'react';

export function CourseCard({ course, onEnroll, enrolled = false }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-primary to-secondary">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl">
            🎓
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
          {course.rating > 0 && (
            <span className="text-yellow-400 text-sm">★ {course.rating.toFixed(1)}</span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

        {/* Meta info */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          {course.instructor && (
            <span>👨‍🏫 {course.instructor.name}</span>
          )}
          {course.level && (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              course.level === 'beginner'
                ? 'bg-blue-100 text-blue-700'
                : course.level === 'intermediate'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {course.level}
            </span>
          )}
        </div>

        {/* Modules and Students */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span>📚 {course.modules?.length || 0} modules</span>
          <span>👥 {course.students?.length || 0} students</span>
        </div>

        {/* Button */}
        <button
          onClick={() => onEnroll?.(course._id)}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            enrolled
              ? 'bg-gray-200 text-gray-700 cursor-default'
              : 'bg-primary text-white hover:bg-primary/80'
          }`}
          disabled={enrolled}
        >
          {enrolled ? '✓ Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
}
