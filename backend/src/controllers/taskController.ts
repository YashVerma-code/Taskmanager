import { Request, Response } from "express";
import { Task } from "../models/Task";

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({tasks,success:true,message:"Successfully got the tasks"});
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" ,success:false});
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        res.status(404).json({ message: "Task not found",success:false });
        return;
      }
      res.status(200).json({task,success:true,message:"Successfully got the task"}); 
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error",success:false });
    }
  };

// Create new task
export const createTask = async (req: Request, res: Response) => {
  try {
    let mongoISOString;
     const{ title, description, deadline ,priority,status} = req.body;
    if(!deadline){
      mongoISOString=Date.now();
    }else{
      const parsedDate = new Date(deadline);
      const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
      mongoISOString = localDate.toISOString().split("T")[0];
    }
    const checkExistingTask=await Task.find({title, description, deadline:mongoISOString ,priority,status});
    if(checkExistingTask){
      res.status(400).json({ message: "Error creating task",success:false});
      return;
    }
    const newTask = new Task({ title, description, deadline:mongoISOString,priority,status });
    await newTask.save();
    res.status(201).json({message:"New task has been created successfully",newTask,success:true});
  } catch (error) {
    console.log("Error : ",error);
    res.status(500).json({ message: "Error creating task",success:false});
  }
};

// Update task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!task) {
        res.status(404).json({ message: "Task not found" ,sucess:false});
        return;
      }
      res.status(200).json({success:true,task,message:"Task has been successfully updated"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating task",success:false });
    }
  };
  

// Delete task
  export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        res.status(404).json({ message: "Task not found" ,success:false});
        return;
      }
      res.status(200).json({ message: "Task deleted successfully",success:true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting task" ,success:false});
    }
  };