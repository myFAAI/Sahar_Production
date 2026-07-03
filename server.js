import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db/config.js';
import coursesRouter from './api/courses.js';
import videosRouter from './api/videos.js';
import quizzesRouter from './api/quizzes.js';
import progressRouter from './api/progress.js';
import authRouter from './api/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:5173'),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/videos', videosRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/progress', progressRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Serve static files from React dist folder in production
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  
  // React SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
} else {
  // Development: root route serves index.html
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Bind to 0.0.0.0 so Railway can detect and expose the port correctly
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
});
