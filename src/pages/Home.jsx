import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Welcome to SA_AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Learn from world-class video lectures, interactive quizzes, and engaging materials.
          Your journey to mastery starts here.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/courses"
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/80 transition"
          >
            Explore Courses
          </Link>
          <Link
            to="/register"
            className="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/5 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Learn with SA_AI?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">Video Lectures</h3>
              <p className="text-gray-600">
                Professional video content with adjustable playback speed, subtitles, and progress tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🧩</div>
              <h3 className="text-xl font-bold mb-2">Interactive Materials</h3>
              <p className="text-gray-600">
                Quizzes, slides, and interactive exercises to reinforce your learning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed completion statistics and scores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-lg">Video Lectures</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-lg">Expert Instructors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-lg">Active Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
