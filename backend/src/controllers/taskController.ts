import { Request, Response } from "express";
import { ITask, Task } from "../models/Task";

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    if (!tasks) {
      res.status(404).json({ message: "Tasks not found", success: false });
      return;
    }
    res
      .status(200)
      .json({ tasks, success: true, message: "Successfully got the tasks" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", success: false });
  }
};

// Get tasks with timeout
export const checkTimeOut = async (req: Request, res: Response) => {
  try {
    const allTasks = await Task.find({ status: { $ne: "done" } });
    if (!allTasks || allTasks.length === 0) {
      res.status(404).json({ message: "Tasks not found", success: false });
      return;
    }

    // Go through all tasks and check for timeout condition
    for (const task of allTasks) {
      const currentDate = new Date().toISOString().split('T')[0];  
      const deadlineDate = new Date(task.deadline).toISOString().split('T')[0];   
      console.log("Dates",currentDate,deadlineDate);
      if (
          (currentDate > deadlineDate && task.status !== "done" && task.priority !== "completed") ||
          task.status === "time-out"
      ) {
          if (task.status !== "time-out") {
              task.status = "time-out";
              await task.save(); 
          }
      }
  }
    res.status(200).json({ message: "Tasks checked for time-out", success: true ,allTasks});
  } catch (error) {
    console.error("Error in checkTimeOut:", error);
    res.status(500).json({ message: "Error checking time-outs", success: false });
  }
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
};

// Create new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, deadline, priority, status } = req.body;
    let mongoISOString: string;
    if (!deadline) {
      const today = new Date();
      mongoISOString = today.toISOString().split("T")[0];  // today's date
    } else {
      const parsedDate = new Date(deadline);
      const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
      mongoISOString = localDate.toISOString().split("T")[0];
    }

    
    const existingTask = await Task.findOne({
      title,
      deadline: mongoISOString,
      priority,
    });

    if (existingTask) {
      res.status(400).json({
        message: "Task with the same title, deadline, and priority already exists.",
        success: false,
      });
      return;
    }

    // Create new task
    const newTask = new Task({
      title,
      description,
      deadline: mongoISOString,
      priority,
      status: status || "to-do", 
      createdAt: new Date(), 
    });

    await newTask.save();

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
};


// Update task
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      res.status(404).json({ message: "Task not found", sucess: false });
      return;
    }
    res
      .status(200)
      .json({
        success: true,
        task,
        message: "Task has been successfully updated",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task", success: false });
  }
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found", success: false });
      return;
    }
    res
      .status(200)
      .json({ message: "Task deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting task", success: false });
  }
};
