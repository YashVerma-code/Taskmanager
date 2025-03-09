import express from "express";
import asyncHandler from "express-async-handler";
import { changeTaskStatus, checkTimeOut, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskController";

const router = express.Router();

router.get("/",getTasks);
router.post("/", asyncHandler(createTask));
router.get("/time-out",checkTimeOut)
router.get("/:id", asyncHandler(getTaskById));
router.put("/:id", asyncHandler(updateTask));
router.patch("/:id", asyncHandler(changeTaskStatus));
router.delete("/:id", asyncHandler(deleteTask));

export default router;



