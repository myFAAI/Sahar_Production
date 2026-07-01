import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    videosWatched: 0,
    quizzesCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user's enrolled courses
        const response = await fetch('/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const courses = await response.json();
        const enrolled = courses.filter(c =>
          c.students?.some(s => (s._id || s).toString() === user.id)
        );
        setEnrolledCourses(enrolled);

        // Update stats
        setStats({
          coursesEnrolled: enrolled.length,
          videosWatched: 0, // TODO: fetch from progress
          quizzesCompleted: 0 // TODO: fetch from progress
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-gray-600 capitalize">Role: {user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-gray-600 text-sm">Courses Enrolled</p>
            <p className="text-3xl font-bold">{stats.coursesEnrolled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-gray-600 text-sm">Videos Watched</p>
            <p className="text-3xl font-bold">{stats.videosWatched}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-600 text-sm">Quizzes Completed</p>
            <p className="text-3xl font-bold">{stats.quizzesCompleted}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link
              to="/courses"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition"
            >
              Browse Courses
            </Link>
            {user.role === 'instructor' && (
              <Link
                to="/create-course"
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/80 transition"
              >
                Create Course
              </Link>
            )}
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
          {enrolledCourses.length === 0 ? (
            <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow transition">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <Link to={`/lecture/${course._id}`} className="text-primary font-semibold text-sm hover:underline">
                    Continue Learning
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
