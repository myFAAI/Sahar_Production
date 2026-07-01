import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { VideoPlayer } from '../components/VideoPlayer';
import { Quiz } from '../components/Quiz';
import { Slides } from '../components/Slides';

export function Lecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // video, quiz, materials
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error('Course not found');
        const data = await response.json();
        setCourse(data);

        // Set first module and video
        if (data.modules && data.modules.length > 0) {
          setCurrentModule(data.modules[0]);
          if (data.modules[0].videos && data.modules[0].videos.length > 0) {
            setCurrentVideo(data.modules[0].videos[0]);
          }
          if (data.modules[0].quiz) {
            setCurrentQuiz(data.modules[0].quiz);
          }
          if (data.modules[0].materials && data.modules[0].materials.length > 0) {
            setCurrentMaterial(data.modules[0].materials[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 text-primary font-semibold hover:underline"
          >
            Go back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-600">{currentModule?.title}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8">
        {/* Sidebar - Course Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sticky top-20">
            <h2 className="font-bold mb-4">Course Modules</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {course.modules?.map((module, idx) => (
                <div key={module._id}>
                  <button
                    onClick={() => {
                      setCurrentModule(module);
                      if (module.videos?.length > 0) {
                        setCurrentVideo(module.videos[0]);
                      }
                      setActiveTab('video');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      currentModule?._id === module._id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-semibold">Module {idx + 1}</span>
                    <p className="text-xs truncate">{module.title}</p>
                  </button>

                  {/* Videos in module */}
                  {currentModule?._id === module._id && module.videos?.length > 0 && (
                    <div className="ml-4 space-y-1 mt-2">
                      {module.videos.map((video, vIdx) => (
                        <button
                          key={video._id}
                          onClick={() => {
                            setCurrentVideo(video);
                            setActiveTab('video');
                          }}
                          className={`w-full text-left text-xs px-2 py-1 rounded transition ${
                            currentVideo?._id === video._id
                              ? 'bg-primary/20 text-primary font-semibold'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          🎬 {video.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 font-semibold transition border-b-2 ${
                activeTab === 'video'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📽 Video Lecture
            </button>
            {currentMaterial && (
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 font-semibold transition border-b-2 ${
                  activeTab === 'materials'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📄 Materials
              </button>
            )}
            {currentQuiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 font-semibold transition border-b-2 ${
                  activeTab === 'quiz'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                ✅ Quiz
              </button>
            )}
          </div>

          {/* Content */}
          {activeTab === 'video' && currentVideo && (
            <VideoPlayer
              video={currentVideo}
              userId={user?.id}
              courseId={courseId}
            />
          )}

          {activeTab === 'materials' && currentMaterial && (
            <Slides material={currentMaterial} />
          )}

          {activeTab === 'quiz' && currentQuiz && (
            <Quiz
              quiz={currentQuiz}
              onSubmit={(result) => {
                console.log('Quiz submitted:', result);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
