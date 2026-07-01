import express from 'express';
import { Quiz, Question } from '../db/models.js';
import { authenticateToken, authorizeRole } from './middleware.js';

const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('module')
      .populate('questions');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz by module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ module: req.params.moduleId })
      .populate('questions');
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions');
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create quiz
router.post('/', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const { title, module } = req.body;

    if (!title || !module) {
      return res.status(400).json({ error: 'Title and module are required' });
    }

    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add question to quiz
router.post('/:id/questions', authenticateToken, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const { questionText, type, options, correctAnswer, explanation, points } = req.body;

    if (!questionText || !type) {
      return res.status(400).json({ error: 'Question text and type are required' });
    }

    const question = new Question({
      quiz: req.params.id,
      questionText,
      type,
      options,
      correctAnswer,
      explanation,
      points: points || 1
    });

    await question.save();

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $push: { questions: question._id } },
      { new: true }
    );

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz answers
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers object is required' });
    }

    const quiz = await Quiz.findById(req.params.id).populate('questions');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.questions.length === 0) {
      return res.status(400).json({ error: 'Quiz has no questions' });
    }

    let correctCount = 0;
    const results = [];

    for (const question of quiz.questions) {
      const userAnswer = answers[question._id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      results.push({
        questionId: question._id,
        questionText: question.questionText,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    res.json({
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
