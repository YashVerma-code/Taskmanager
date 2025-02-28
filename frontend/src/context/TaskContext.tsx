import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TaskItemType } from "../types/TaskItem";

// Define the context type including activeCard and its setter
type TaskContextType = {
  todoTasks: TaskItemType[];
  ongoingTasks: TaskItemType[];
  completedTasks: TaskItemType[];
  expiredTasks: TaskItemType[];
  fetchTasks: () => void;
  activeCard: TaskItemType | undefined;
  setActiveCard: (task: TaskItemType | undefined) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const priorityOrder: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [todoTasks, setTodoTasks] = useState<TaskItemType[]>([]);
  const [ongoingTasks, setOngoingTasks] = useState<TaskItemType[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskItemType[]>([]);
  const [expiredTasks, setExpiredTasks] = useState<TaskItemType[]>([]);
  const [activeCard, setActiveCard] = useState<TaskItemType | undefined>(undefined);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Internal Server error while loading tasks.");
      }

      const tasks = await response.json();
      if (!tasks?.tasks) {
        throw new Error("There are no tasks in the database.");
      }

      setTodoTasks([]);
      setOngoingTasks([]);
      setCompletedTasks([]);
      setExpiredTasks([]);

      const todo: TaskItemType[] = [];
      const ongoing: TaskItemType[] = [];
      const completed: TaskItemType[] = [];
      const expired: TaskItemType[] = [];

      const now = new Date();

      tasks.tasks.forEach((task: TaskItemType) => {
        const taskDeadline = new Date(task.deadline as Date);

        if (task.status !== "done" && taskDeadline < now) {
          expired.push(task);
        } else {
          switch (task.status) {
            case "done":
              completed.push(task);
              break;
            case "on-progress":
              ongoing.push(task);
              break;
            case "to-do":
              todo.push(task);
              break;
          }
        }
      });

      const sortByPriority = (a: TaskItemType, b: TaskItemType) =>
        (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);

      setTodoTasks([...todo].sort(sortByPriority));
      setOngoingTasks([...ongoing].sort(sortByPriority));
      setCompletedTasks([...completed].sort(sortByPriority));
      setExpiredTasks([...expired].sort(sortByPriority));
    } catch (error) {
      console.error("Error: ", error);
      setTodoTasks([]);
      setOngoingTasks([]);
      setCompletedTasks([]);
      setExpiredTasks([]);
    }
  };

  // Periodic refresh every 30 seconds
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        todoTasks,
        ongoingTasks,
        completedTasks,
        expiredTasks,
        fetchTasks,
        activeCard,
        setActiveCard,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
