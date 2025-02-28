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
      return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", success: false });
    return;
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
    const { title, description, deadline, priority, status } = req.body;
    let mongoISOString: string;
    let newStatus: string;
    newStatus=status;
    if (!deadline) {
      const today = new Date();
      mongoISOString = today.toISOString().split("T")[0];  // today's date
    } else {
      const parsedDate = new Date(deadline);
      const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
      mongoISOString = localDate.toISOString().split("T")[0];
    }
    const deadlineDate = new Date(deadline).toISOString().split('T')[0];
    const today = new Date();
    const todayNew = today.toISOString().split("T")[0]; 
    if (
      (todayNew > deadlineDate && status !== "done" && priority !== "completed") ||
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
    });

    if (existingTask) {
      res.status(400).json({
        message: "Task with the same title, deadline, and priority already exists.",
        success: false,
      });
      return;
    }
     
    if(priority==="completed"){
      newStatus="done";
    }
    // Create new task
    const newTask = new Task({
      title,
      description,
      deadline: mongoISOString,
      priority,
      status: newStatus , 
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
  return;
};


// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, deadline, priority, status } = req.body;

    console.log("Data: ", req.body);

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found in database.", success: false });
      return;
    }

    const deadlineDate = new Date(deadline).toISOString().split('T')[0];
    const todayDate = new Date().toISOString().split("T")[0];

    let newStatus = status;

    if (
      (todayDate > deadlineDate && status !== "done" && priority !== "completed") ||
      status === "time-out"
    ) {
      if (status !== "time-out") {
        newStatus = "time-out";
      }
    }
    if(priority==="completed"){
      newStatus="done";
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
  return;
};

// Change Task Status
const VALID_STATUSES = ["to-do", "on-progress", "done", "time-out"];

// Change Task Status
export const changeTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;  
    const taskId = req.params.id;  

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ message: "Invalid or missing status", success: false });
      return;
    }

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found", success: false });
      return;
    }

    if (status === "on-progress" || status === "to-do") {
      const todayDate = new Date().toISOString().split("T")[0];
      const taskDeadline = new Date(task.deadline).toISOString().split("T")[0];

      if (todayDate > taskDeadline && task.status !== "done" && task.priority !== "completed") {
        task.status = "time-out";  // Auto timeout if deadline passed
      } else {
        task.status = status;
      }
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
    res.status(500).json({ message: "Error changing task status", success: false });
  }
  return;
};
