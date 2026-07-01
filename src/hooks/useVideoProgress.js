import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useVideoProgress(videoId, userId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchProgress = useCallback(async () => {
    if (!videoId || !userId) return;
    setLoading(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`/api/progress/video/${videoId}/user/${userId}`, { headers });
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  }, [videoId, userId, token]);

  const updateProgress = useCallback(async (videoProgress, videoDuration, completed = false) => {
    if (!videoId || !userId) return;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`/api/progress/video/${videoId}/user/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ videoProgress, videoDuration, completed })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update progress');
      setProgress(data);
      return data;
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }, [videoId, userId, token]);

  return { progress, loading, fetchProgress, updateProgress };
}
