import express from "express";
import asyncHandler from "express-async-handler";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskController";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", asyncHandler(getTaskById));
router.put("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;



