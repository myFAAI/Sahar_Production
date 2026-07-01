import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { useAuth } from '../hooks/useAuth';

export function Course() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentCourse, fetchCourse, enrollCourse } = useCourse();
  const { user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await enrollCourse(courseId);
      navigate(`/lecture/${courseId}`);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{currentCourse.title}</h1>
          <p className="text-xl opacity-90">{currentCourse.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Course Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p className="text-gray-700 mb-4">{currentCourse.description}</p>

            {/* Modules */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Course Modules</h3>
              <div className="space-y-3">
                {currentCourse.modules?.map((module, idx) => (
                  <div key={module._id} className="border border-gray-200 rounded-lg p-4 hover:shadow transition">
                    <h4 className="font-semibold mb-2">
                      Module {idx + 1}: {module.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{module.videos?.length || 0} videos</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructor */}
          {currentCourse.instructor && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="text-lg font-bold">{currentCourse.instructor.name}</h3>
                  <p className="text-gray-600">{currentCourse.instructor.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-bold">Course Info</h3>
            <div>
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-lg font-semibold capitalize">{currentCourse.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-lg font-semibold">{currentCourse.students?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-lg font-semibold">★ {currentCourse.rating?.toFixed(1) || '0'}</p>
            </div>
          </div>

          {/* Enroll Button */}
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/80 transition disabled:opacity-50"
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
