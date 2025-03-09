import mongoose, { Schema, Document, models } from "mongoose";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: "to-do" | "on-progress" | "done" | "time-out";
  createdAt: Date;
  deadline: Date;
  priority: "high" | "low" | "completed";
}

const TaskSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["to-do", "on-progress", "done", "time-out"],
    default: "to-do",
  },
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  priority: { type: String, required: true },
});

export const Task = models?.Task || mongoose.model<ITask>("Task", TaskSchema);
