import mongoose from 'mongoose'

// Connect to mongodb
const connectDB = async () => {
  const MONGODB_URL  =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/smart-twitty';

  try {
    const connect = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (err) {
    console.error(`Error ${err}`);
    process.exit(1);
  }
};

export default connectDB;