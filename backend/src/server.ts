import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: [
    'https://taskmate-psi.vercel.app/',  // your frontend domain
    'https://taskmanager-3agh.onrender.com'                     // for local development (optional)
  ],
  credentials: true, // If you are using cookies
};

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
connectDB();

