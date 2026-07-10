# SA_AI - Educational Platform

A modern educational website featuring video lectures, interactive materials, quizzes, and comprehensive progress tracking.

## Features

### 🎬 Video Lectures
- Professional video player with controls (play, pause, speed adjustment)
- Progress tracking with resume functionality
- Transcript support
- View count tracking
- Subtitle support

### 🧩 Interactive Materials
- **Quizzes**: Multiple choice, true/false, short answer, essay
- **Slides**: Embedded presentations
- **Resources**: PDFs, articles, downloadable materials
- Immediate feedback with explanations

### 📊 Progress Tracking
- User enrollment and course management
- Video progress tracking (resume from last position)
- Quiz scoring and results
- Completion statistics
- Personalized dashboard

### 👥 User Management
- Student and Instructor roles
- User authentication with JWT
- Profile management
- Course enrollment system

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB
- **Authentication**: JWT
- **Security**: bcryptjs password hashing

### Frontend
- **Library**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router

### Video Streaming
- MP4/WebM support
- HLS streaming ready
- Integration with Vimeo/YouTube possible

## Project Structure

```
SA_AI/
├── server.js                 # Express server entry point
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
│
├── db/
│   ├── config.js           # MongoDB connection
│   └── models.js           # Mongoose schemas (User, Course, Video, Quiz, Progress, etc.)
│
├── api/
│   ├── auth.js             # Authentication routes
│   ├── courses.js          # Course management routes
│   ├── videos.js           # Video routes
│   ├── quizzes.js          # Quiz routes
│   └── progress.js         # Progress tracking routes
│
├── public/
│   ├── index.html          # React entry point
│   ├── videos/             # Video storage
│   └── assets/             # Static assets
│
└── src/
    ├── components/
    │   ├── VideoPlayer.jsx    # Video playback component
    │   ├── Quiz.jsx           # Interactive quiz component
    │   ├── Slides.jsx         # Presentation slides
    │   ├── CourseCard.jsx     # Course listing card
    │   └── Navigation.jsx     # Navigation bar
    │
    ├── pages/
    │   ├── Home.jsx          # Landing page
    │   ├── Courses.jsx       # Course catalog
    │   ├── Course.jsx        # Course details
    │   ├── Lecture.jsx       # Lecture/learning interface
    │   ├── Login.jsx         # Login page
    │   ├── Register.jsx      # Registration page
    │   └── Dashboard.jsx     # User dashboard
    │
    ├── context/
    │   ├── AuthContext.jsx   # Authentication state
    │   └── CourseContext.jsx # Course state
    │
    ├── hooks/
    │   ├── useAuth.js        # Auth hook
    │   ├── useCourse.js      # Course hook
    │   └── useVideoProgress.js # Video progress hook
    │
    ├── types/                # TypeScript type definitions
    ├── utils/                # Utility functions
    ├── styles/
    │   └── index.css         # Global styles
    ├── App.jsx               # Main app component
    └── index.jsx             # React entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Railway Deployment
- Add your MongoDB connection string in Railway as `MONGODB_URI`.
- The app also accepts `MONGODB_URL`, `MONGO_URL`, or `DATABASE_URL` if your Railway database plugin exposes a different name.
- If no database URI is set, the server falls back to `mongodb://localhost:27017/sa_ai` for local development.

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

3. **Start MongoDB** (if local)
```bash
mongod
```

4. **Start development server**

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

Visit `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Courses
- `GET /api/courses` - Get all courses with filtering
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/module/:moduleId` - Get module videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos` - Create video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/questions` - Add question
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Progress Tracking
- `GET /api/progress/course/:courseId/user/:userId` - Get course progress
- `GET /api/progress/video/:videoId/user/:userId` - Get video progress
- `PUT /api/progress/video/:videoId/user/:userId` - Update video progress
- `PUT /api/progress/quiz/:quizId/user/:userId` - Update quiz score
- `GET /api/progress/stats/:courseId/user/:userId` - Get completion stats

## Database Schema

### User
- Email, password (hashed), name
- Role (student/instructor/admin)
- Enrolled courses
- Profile info

### Course
- Title, description, thumbnail
- Instructor, category, level
- Modules, students, rating
- Reviews

### Module
- Title, description, order
- Videos, materials, quiz

### Video
- Title, URL, duration
- Transcript, subtitles
- Thumbnail, views

### Quiz
- Title, questions
- Passing score, time limit
- Attempts allowed

### Progress
- User, course, video
- Video progress (0-100%)
- Quiz score
- Completion status

## Features for Enhancement

- [ ] Live classes/streaming
- [ ] Discussion forums
- [ ] Certificates upon completion
- [ ] Video analytics
- [ ] Payment integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Social sharing
- [ ] Advanced search/filtering
- [ ] Content recommendations

## Development

### Common Tasks

**Create new React page:**
1. Create file in `src/pages/`
2. Add route in `App.jsx`

**Add new API endpoint:**
1. Create route file in `api/`
2. Import in `server.js`

**Update database schema:**
1. Modify model in `db/models.js`
2. Update relevant API routes

## Security Considerations

- JWT tokens stored securely
- Password hashing with bcryptjs
- CORS enabled with specific origins
- Input validation on backend
- Environment variables for secrets

## Performance Tips

- Use lazy loading for videos
- Implement caching for course data
- Optimize database queries with indexes
- CDN for video hosting
- Compress images and assets

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project for educational purposes

## Support

For issues and questions, please create an issue in the repository.

---

Happy Learning! 🎓
