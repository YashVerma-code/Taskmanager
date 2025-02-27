import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
const MONGO_URL = process.env.MONGO_URL;

export const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    if (!MONGO_URL) throw new Error("Missing MONGODB_URL");
    const db=await mongoose.connect( MONGO_URL || '',{});
    connection.isConnected= db.connections[0].readyState;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
