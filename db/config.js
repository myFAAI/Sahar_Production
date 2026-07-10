import mongoose from 'mongoose';

let connectionAttempt = 0;

function getRetryDelay(attempt) {
  return Math.min(30000, 2000 * Math.max(1, attempt));
}

function getMongoUri() {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/sa_ai')
  );
}

export async function connectDB() {
  try {
    connectionAttempt += 1;
    const uri = getMongoUri();

    if (!uri) {
      throw new Error('No MongoDB URI configured. Set MONGODB_URI, MONGODB_URL, MONGO_URL, or DATABASE_URL.');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`📊 MongoDB connected: ${conn.connection.host}`);
    connectionAttempt = 0;
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    const delay = getRetryDelay(connectionAttempt);
    console.log(`🔁 Retrying MongoDB connection in ${Math.round(delay / 1000)}s...`);
    setTimeout(() => {
      connectDB().catch((retryError) => {
        console.error(`❌ MongoDB retry failed: ${retryError.message}`);
      });
    }, delay);
    return null;
  }
}

export default connectDB;
