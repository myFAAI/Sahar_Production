import React, { useRef, useEffect, useState } from 'react';
import { useVideoProgress } from '../hooks/useVideoProgress';

export function VideoPlayer({ video, userId, courseId }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const { progress, updateProgress } = useVideoProgress(video?._id, userId);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoEl.duration);
    };

    const handleEnded = () => {
      updateProgress(videoEl.duration, videoEl.duration, true);
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoEl.addEventListener('ended', handleEnded);

    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoEl.removeEventListener('ended', handleEnded);
    };
  }, [video, updateProgress]);

  // Save progress every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        updateProgress(currentTime, duration);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, updateProgress]);

  if (!video) {
    return <div className="w-full bg-black rounded-lg p-4 text-white">No video selected</div>;
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-gray-900">
        <video
          ref={videoRef}
          src={video?.videoUrl}
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition">
          {/* Progress Bar */}
          <div className="w-full mb-2">
            <div
              className="w-full h-1 bg-gray-600 rounded cursor-pointer hover:h-2 transition"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                const time = percentage * duration;
                videoRef.current.currentTime = time;
                setCurrentTime(time);
              }}
            >
              <div
                className="h-full bg-primary rounded"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="hover:text-primary transition"
              >
                {isPlaying ? '⏸' : '▶'} {isPlaying ? 'Pause' : 'Play'}
              </button>

              <div className="flex items-center gap-2">
                <label className="text-sm">Speed:</label>
                <select
                  value={speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="bg-gray-700 rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
            </div>

            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="bg-white p-4">
        <h2 className="text-xl font-bold mb-2">{video?.title}</h2>
        <p className="text-gray-600 mb-2">{video?.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>👁 {video?.views || 0} views</span>
          <span>⏱ {formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
