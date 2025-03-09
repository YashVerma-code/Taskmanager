import { Request, Response } from "express";
import { Task } from "../models/Task";
import User from "../models/User";
const VALID_STATUSES = ["to-do", "on-progress", "done", "time-out"];

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    // console.log("User Id: ", userId);
    const user = await User.findById(userId).populate("tasks");
    if (!user) {
      res.status(404).send({ message: "User not found", success: false });
      return;
    }
    const tasks = await user.tasks;
    // console.log("tasks: ", tasks);

    if (!tasks) {
      res.status(404).json({ message: "Tasks not found", success: false });
      return;
    }
    res
      .status(200)
      .json({ tasks, success: true, message: "Successfully got the tasks" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", success: false });
    return;
  }
};

// Get tasks with timeout
export const checkTimeOut = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];

    
    const result = await Task.updateMany(
      {
        status: { $ne: "done" }, 
        deadline: { $lt: currentDate }, 
        priority: { $ne: "completed" }, 
      },
      { $set: { status: "time-out" } }
    );

    if (result.matchedCount === 0) {
      res
        .status(404)
        .json({ message: "No tasks required a status update", success: false });
      return;
    }

    res.status(200).json({
      message: `${result.modifiedCount} task(s) marked as 'time-out'`,
      success: true,})
  } catch (error) {
    console.error("Error in checkTimeOut:", error);
    res
      .status(500)
      .json({ message: "Error checking time-outs", success: false });
  }
  return;
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found", success: false });
      return;
    }
    res
      .status(200)
      .json({ task, success: true, message: "Successfully got the task" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
  return;
};

// Create new task
export const createTask = async (req: Request, res: Response) => {
  try {
    // console.log("Req: ",req);
    const { title, description, deadline, priority, status } =await req.body;
    // console.log("Response: ",title,deadline,description,priority,status);
    const userId = (req as any).user.userId;
    if (!userId) {
      res
        .status(403)
        .send({ message: "User not authenticated", success: false });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: "User not found", success: false });
      return;
    }

    let mongoISOString: string;
    let newStatus: string;
    newStatus = status;

    if (!deadline) {
      const today = new Date();
      mongoISOString = today.toISOString().split("T")[0];
    } else {
      const parsedDate = new Date(deadline);
      const localDate = new Date(
        parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000
      );
      mongoISOString = localDate.toISOString().split("T")[0];
    }

    const today = new Date();
    const todayNew = today.toISOString().split("T")[0];
    if (
      (todayNew > mongoISOString &&
        todayNew != mongoISOString &&
        status !== "done" &&
        priority !== "completed") ||
      status === "time-out"
    ) {
      if (status !== "time-out") {
        newStatus = "time-out";
      }
    }

    const existingTask = await Task.findOne({
      title,
      deadline: mongoISOString,
      priority,
      userId,
    });

    if (existingTask) {
      res.status(400).json({
        message:
          "Task with the same title, deadline, and priority already exists.",
        success: false,
      });
      return;
    }

    if (priority === "completed") {
      newStatus = "done";
    }
    // Create new task
    const newTask = await Task.create({
      title,
      description,
      deadline: mongoISOString,
      priority,
      status: newStatus,
      createdAt: new Date(),
      userId,
    });
    await newTask.save();

    const updateUserTasks = await User.updateOne(
      {
        _id: userId,
      },
      {
        $push: {
          tasks: newTask,
        },
      }
    );
    // console.log("Update response: ",updateUserTasks);
    res.status(201).json({
      message: "New task has been created successfully",
      newTask,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating task", success: false });
    return;
  }
  return;
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, deadline, priority, status } = req.body;
    // console.log("Updating task: ",title,description,deadline,priority,status);
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(403)
        .send({ message: "User not authenticated", success: false });
      return;
    }

    const user = await User.findById(userId).populate("tasks");
    if (!user) {
      res.status(404).send({ message: "User not found", success: false });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res
        .status(404)
        .json({ message: "Task not found in database.", success: false });
      return;
    }

    const deadlineDate = new Date(deadline).getTime();
    const todayDate = new Date().getTime();

    let newStatus = status;

    if (
      (todayDate > deadlineDate && status !== "done") ||
      status === "time-out"
    ) {
      newStatus = "time-out";
    }

    if (priority === "completed") {
      newStatus = "done";
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        deadline,
        priority,
        status: newStatus,
      },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task update failed", success: false });
      return;
    }

    res.status(200).json({
      success: true,
      task: updatedTask,
      message: "Task has been successfully updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task", success: false });
  }
  return;
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(403)
        .json({ message: "User not authenticated", success: false });
      return;
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found", success: false });
      return;
    }
    const user = await User.findById(userId);
    if (!user || !user.tasks.includes(task._id)) {
      res
        .status(403)
        .json({ message: "Unauthorized task deletion", success: false });
      return;
    }

    await Task.findByIdAndDelete(task._id);

    // Remove task from user's tasks array
    await User.findByIdAndUpdate(userId, {
      $pull: { tasks: task._id },
    });

    res
      .status(200)
      .json({ message: "Task deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting task", success: false });
  }
  return;
};

// Change Task Status
export const changeTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    console.log("Changing status : ",status);
    const taskId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(403)
        .json({ message: "User not authenticated", success: false });
      return;
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      res
        .status(400)
        .json({ message: "Invalid or missing status", success: false });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found", success: false });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.tasks.includes(task._id)) {
      res
        .status(403)
        .json({ message: "Unauthorized task modification", success: false });
      return;
    }

    // Status logic refinement
    const todayDate = new Date().toISOString().split("T")[0];
    const taskDeadline = new Date(task.deadline).toISOString().split("T")[0];

    if (["on-progress", "to-do"].includes(status)) {
      task.status =
        todayDate > taskDeadline &&
        task.status !== "done" &&
        task.priority !== "completed"
          ? "time-out"
          : status;
    } else {
      task.status = status;
    }

    if (status === "done") {
      task.priority = "completed";
    }

    await task.save();

    res.status(200).json({
      success: true,
      task,
      message: `Task status updated to '${task.status}' successfully`,
    });
  } catch (error) {
    console.error("Error in changeTaskStatus:", error);
    res
      .status(500)
      .json({ message: "Error changing task status", success: false });
  }
  return;
};
