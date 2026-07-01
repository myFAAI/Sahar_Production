# SA_AI Development Guide

## Architecture Overview

```
User Browser (React)
       ↓
   Vite Dev Server (5173)
       ↓
   React Components + Router
       ↓
   Express API (5000)
       ↓
   MongoDB Database
```

## Key Concepts

### Authentication Flow
1. User registers/logs in via form
2. API validates credentials and returns JWT token
3. Token stored in localStorage
4. Token sent with subsequent API requests
5. useAuth hook manages auth state globally

### Course/Video Viewing Flow
1. User browses courses from `/courses`
2. Enrolls in a course
3. Navigates to `/lecture/:courseId`
4. Views video with progress tracking
5. Takes quiz and views results

### Progress Tracking
- Video progress saved every 5 seconds while watching
- Quiz scores saved on submission
- Dashboard aggregates progress stats

## Important Patterns Used

### Context API for State Management
```jsx
const { user, token, login, logout } = useAuth();
```

### Custom Hooks for Data Fetching
```jsx
const { progress, updateProgress } = useVideoProgress(videoId, userId);
```

### Component Composition
- Reusable components (VideoPlayer, Quiz, CourseCard)
- Smart pages that manage data
- Layout components for structure

## Adding New Features

### Adding a New Page
1. Create file in `src/pages/NewPage.jsx`
2. Export component
3. Add route in `App.jsx`
4. Link from Navigation or other pages

### Adding a New API Endpoint
1. Create route in `api/newroute.js`
2. Import and use in `server.js`
3. Test with curl or Postman
4. Use in React components with fetch

### Adding Database Model
1. Add schema to `db/models.js`
2. Export model
3. Use in API routes
4. Update types if using TypeScript

## Testing

### Manual Testing Checklist
- [ ] User registration
- [ ] User login/logout
- [ ] Browse courses
- [ ] View course details
- [ ] Enroll in course
- [ ] Watch video with progress
- [ ] Complete quiz
- [ ] Check dashboard stats

### API Testing
```bash
# Test auth endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password"}'
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Lazy load pages with React.lazy()
- Optimize images
- Bundle analysis with Vite

### Backend
- Add database indexes
- Implement caching
- Limit query results with pagination
- Use projection to select fields

### Database
```javascript
// Good: Select only needed fields
User.find().select('name email');

// Bad: Select all fields unnecessarily
User.find();

// Index frequently queried fields
db.users.createIndex({ email: 1 });
```

## Debugging Tips

### Browser Console Errors
- Check network tab for failed requests
- Look at API response bodies
- Check auth token validity

### Server Errors
- Check server terminal for error messages
- Add console.log for debugging
- Use try-catch and error handlers

### Database Issues
- Connect to MongoDB directly: `mongosh`
- Query data: `db.users.find()`
- Check indexes: `db.users.getIndexes()`

## Common Issues & Solutions

### "Cannot find module" error
- Run `npm install`
- Check import paths
- Restart dev server

### 401 Unauthorized on API calls
- Token might be expired
- Token not being sent with request
- Check Authorization header

### CORS errors
- Update CORS_ORIGIN in .env
- Ensure API allows frontend URL
- Restart backend server

### Videos not loading
- Check videoUrl path
- Ensure video files exist in public/videos
- Verify CORS headers for video URLs

## Performance Metrics

Monitor these in production:
- Page load time (target <3s)
- Video playback quality
- API response time (target <200ms)
- Database query time (target <100ms)

## Security Checklist

- [ ] Environment variables not in version control
- [ ] Passwords hashed with bcryptjs
- [ ] JWTs have expiration
- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] SQL injection prevention (using Mongoose ORM)
- [ ] HTTPS in production

## Resources

- React: https://react.dev
- Express: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev

## Support

Ask questions in code comments or create GitHub issues!
