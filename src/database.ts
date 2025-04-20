import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // .env file se variables load karega

const mongoURI = process.env.MONGO_URI as string; // MongoDB URI

const connectDB = async () => {
  try {
    // Connect to MongoDB using mongoose
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1); // If connection fails, exit process
  }
};

export default connectDB;
