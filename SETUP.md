# Getting Started with SA_AI

## Prerequisites
- Node.js 16 or higher
- npm or yarn
- MongoDB (local or MongoDB Atlas cloud)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure secret key for JWT tokens
# - PORT: Server port (default 5000)
# - CORS_ORIGIN: Frontend URL (default http://localhost:5173)
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Verify connection
# MongoDB will be available at mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<cluster-url>` in `.env`

### 4. Start the Application

**Terminal 1 - Start Backend Server**
```bash
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server**
```bash
npm run dev:frontend
# Frontend runs on http://localhost:5173
```

### 5. Access the Application
Open your browser and go to: **http://localhost:5173**

## Initial Setup

### Create Test Data

1. **Register as Admin/Instructor**
   - Go to http://localhost:5173/register
   - Select "Instructor" role
   - Create your account

2. **Create a Course** (via API)
   ```bash
   curl -X POST http://localhost:5000/api/courses \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Introduction to Web Development",
       "description": "Learn the basics of web development",
       "instructor": "YOUR_USER_ID",
       "category": "Programming",
       "level": "beginner"
     }'
   ```

3. **Add Videos/Materials/Quizzes**
   - Use the API endpoints or frontend interface

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify credentials for MongoDB Atlas

### Port Already in Use
```bash
# Change ports in .env and vite.config.js
# Or kill the process using the port
lsof -i :5000  # Find process
kill -9 PID    # Kill process
```

### CORS Errors
- Update `CORS_ORIGIN` in `.env` to match your frontend URL

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Build for Production

### Build Frontend
```bash
npm run build
# Creates dist/ folder with optimized build
```

### Deploy
See deployment guides for Vercel, Netlify, or your preferred hosting service.

## Project Structure
See [README.md](./README.md) for full project structure documentation.

## API Documentation
All API endpoints are documented in the README.md file.

## Development Tips

- Use React DevTools for debugging
- Check Network tab in browser DevTools for API calls
- Tail server logs: `tail -f server.log`
- Enable debug logging in API routes for troubleshooting

## Next Steps

1. Create sample courses and videos
2. Build the admin dashboard
3. Add more interactive features
4. Deploy to production
5. Set up CI/CD pipeline

For more help, check the README.md or create an issue on GitHub!
