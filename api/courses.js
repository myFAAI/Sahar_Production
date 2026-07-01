import express from 'express';
import { Course, Module } from '../db/models.js';
import { authenticateToken, authorizeRole } from './middleware.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('modules')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio profileImage')
      .populate({
        path: 'modules',
        populate: [
          { path: 'videos' },
          { path: 'materials' },
          { path: 'quiz' }
        ]
      })
      .populate('reviews');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create course (instructor only)
router.post('/', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const { title, description, category, level } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const course = new Course({
      title,
      description,
      category,
      level: level || 'beginner',
      instructor: req.user.id
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put('/:id', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    // Verify ownership
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const { title, description, category, level, thumbnail } = req.body;
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, level, thumbnail },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll user in course
router.post('/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: req.user.id } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
router.delete('/:id', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    // Verify ownership
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
