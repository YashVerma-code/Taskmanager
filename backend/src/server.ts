import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/AuthRouter"
import IsAuthenticated from "./middleware/Auth";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use("/api/tasks", IsAuthenticated,taskRoutes);
app.use("/auth",authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
connectDB();

