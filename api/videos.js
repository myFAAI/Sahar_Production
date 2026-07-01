import express from 'express';
import { Video } from '../db/models.js';
import { authenticateToken, authorizeRole } from './middleware.js';

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('module')
      .sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get videos by module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const videos = await Video.find({ module: req.params.moduleId }).sort({ order: 1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('module');

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create video
router.post('/', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const { title, module, videoUrl } = req.body;

    if (!title || !module || !videoUrl) {
      return res.status(400).json({ error: 'Title, module, and videoUrl are required' });
    }

    const video = new Video(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update video
router.put('/:id', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete video
router.delete('/:id', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
