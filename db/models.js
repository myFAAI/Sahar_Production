import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  bio: String,
  profileImage: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: String,
  category: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  duration: Number,
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Module Schema (Lessons/Sections)
const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: Number,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  createdAt: { type: Date, default: Date.now }
});

// Video Schema
const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  videoUrl: { type: String, required: true },
  thumbnail: String,
  duration: Number,
  transcript: String,
  subtitles: [
    {
      language: String,
      url: String
    }
  ],
  order: Number,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Material Schema (Slides, PDFs, Resources)
const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  type: { type: String, enum: ['slides', 'pdf', 'article', 'resource'], required: true },
  fileUrl: String,
  content: String,
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  passingScore: { type: Number, default: 70 },
  timeLimit: Number,
  attempts: { type: Number, default: -1 },
  createdAt: { type: Date, default: Date.now }
});

// Question Schema
const QuestionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  questionText: { type: String, required: true },
  type: { type: String, enum: ['multipleChoice', 'trueFalse', 'shortAnswer', 'essay'], required: true },
  options: [String],
  correctAnswer: String,
  explanation: String,
  points: { type: Number, default: 1 },
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

// Progress Schema (User's course/video progress)
const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  videoDuration: Number,
  videoProgress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  quizScore: Number,
  lastWatchedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Review Schema
const ReviewSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
export const Course = mongoose.model('Course', CourseSchema);
export const Module = mongoose.model('Module', ModuleSchema);
export const Video = mongoose.model('Video', VideoSchema);
export const Material = mongoose.model('Material', MaterialSchema);
export const Quiz = mongoose.model('Quiz', QuizSchema);
export const Question = mongoose.model('Question', QuestionSchema);
export const Progress = mongoose.model('Progress', ProgressSchema);
export const Review = mongoose.model('Review', ReviewSchema);
