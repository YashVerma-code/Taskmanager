import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  category: "To Do" | "In Progress" | "Done" | "Timeout";
  createdAt: Date;
  timeoutAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["To Do", "In Progress", "Done", "Timeout"], 
    default: "To Do" 
  },
  createdAt: { type: Date, default: Date.now },
  timeoutAt: { type: Date, required: true },
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);
