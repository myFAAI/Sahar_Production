import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { Course } from './pages/Course';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Lecture } from './pages/Lecture';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<Course />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lecture/:courseId" element={<Lecture />} />
          </Routes>
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
