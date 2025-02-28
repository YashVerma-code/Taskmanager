import React from "react";
import "./tasklist.css";
import { TaskListProps } from "../../types/TaskListProps";
import TaskItem from "../TaskItem/TaskItem";
import { useTasks } from "@/context/TaskContext";

const TaskList: React.FC<TaskListProps> = ({ header, taskItems }) => {
  const {fetchTasks ,setActiveCard,activeCard} = useTasks();
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!activeCard) return; 

    const newStatus = header; 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${activeCard._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task status");
      }

      fetchTasks(); 
      setActiveCard(undefined); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return (
    <div className="tasklist-card">
      <div
        className={`tasklist-header ${
          header === "to-do"
            ? "todoborder"
            : header === "on-progress"
            ? "onprogressborder"
            : header === "done"
            ? "doneborder"
            : ""
        } `}
      >
        <div className="tasklist-header-inside">
          <span
            className={`tasklist-dot ${
              header === "to-do"
                ? "todo"
                : header === "on-progress"
                ? "onprogress"
                : header === "done"
                ? "done"
                : ""
            }`}
          ></span>
          <h2 className="tasklist-title">
            {header === "to-do"
              ? "To Do"
              : header === "on-progress"
              ? "On Progress"
              : header === "done"
              ? "Done"
              : ""}
          </h2>
        </div>
        <div className="tasklist-number">
          {taskItems.length > 0 ? taskItems.length : "0"}
        </div>
      </div>
      <div className="taksitems-card"  onDrop={handleDrop}
        onDragOver={handleDragOver}>
        {taskItems.length > 0 ? (
          taskItems.map((taskitem, index) => (
            <div key={index}  >
              <TaskItem taskitem={taskitem} />
            </div>
          )) 
        ) : (
          <p className="no-tasks">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
