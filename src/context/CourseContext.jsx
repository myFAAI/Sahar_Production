import React, { createContext, useState, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchCourses = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch courses');
      setCourses(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourse = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch course');
      setCurrentCourse(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollCourse = useCallback(async (courseId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Enrollment failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to enroll:', error);
      throw error;
    }
  }, [token]);

  return (
    <CourseContext.Provider value={{ courses, currentCourse, loading, fetchCourses, fetchCourse, enrollCourse }}>
      {children}
    </CourseContext.Provider>
  );
}
