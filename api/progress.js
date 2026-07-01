import express from 'express';
import { Progress } from '../db/models.js';
import { authenticateToken } from './middleware.js';

const router = express.Router();

// Get user progress for a course
router.get('/course/:courseId/user/:userId', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to view this progress' });
  }
  try {
    const progress = await Progress.find({
      course: req.params.courseId,
      user: req.params.userId
    }).populate('video');

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress for a specific video
router.get('/video/:videoId/user/:userId', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to view this progress' });
  }
  try {
    const progress = await Progress.findOne({
      video: req.params.videoId,
      user: req.params.userId
    });

    if (!progress) {
      return res.json(null);
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update video progress
router.put('/video/:videoId/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { videoProgress, videoDuration, completed, courseId } = req.body;

    let progress = await Progress.findOne({
      video: req.params.videoId,
      user: req.params.userId
    });

    if (!progress) {
      progress = new Progress({
        user: req.params.userId,
        video: req.params.videoId,
        course: courseId,
        videoProgress: videoProgress !== undefined ? videoProgress : 0,
        videoDuration: videoDuration !== undefined ? videoDuration : 0
      });
    } else {
      progress.videoProgress = videoProgress !== undefined ? videoProgress : progress.videoProgress;
      progress.videoDuration = videoDuration !== undefined ? videoDuration : progress.videoDuration;
      if (completed !== undefined) progress.completed = completed;
      if (completed) progress.completedAt = new Date();
    }

    progress.lastWatchedAt = new Date();
    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update quiz score
router.put('/quiz/:quizId/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { score, courseId } = req.body;

    let progress = await Progress.findOneAndUpdate(
      { user: req.params.userId, quiz: req.params.quizId },
      {
        quizScore: score,
        course: courseId,
        completed: score >= 70,
        completedAt: score >= 70 ? new Date() : null,
        lastWatchedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course completion stats
router.get('/stats/:courseId/user/:userId', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to view this progress' });
  }
  try {
    const progress = await Progress.find({
      course: req.params.courseId,
      user: req.params.userId
    });

    const totalItems = progress.length;
    const completedItems = progress.filter(p => p.completed).length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const scoredItems = progress.filter(p => p.quizScore !== undefined && p.quizScore !== null);
    const averageQuizScore = scoredItems.length > 0
      ? Math.round(scoredItems.reduce((sum, p) => sum + p.quizScore, 0) / scoredItems.length)
      : 0;

    res.json({
      totalItems,
      completedItems,
      completionPercentage,
      averageQuizScore
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
