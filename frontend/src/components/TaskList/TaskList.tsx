import React from "react";
import "./tasklist.css";
import { TaskListProps } from "../../types/TaskListProps";
import TaskItem from "../TaskItem/TaskItem";

const TaskList: React.FC<TaskListProps> = ({ header, taskItems }) => {
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
      <div className="taksitems-card">
        {taskItems.length > 0 ? (
          taskItems.map((taskitem, index) => (
            <div key={index}>
              <TaskItem taskitem={taskitem} />
            </div>
          )) 
        ) : (
          <p className="no-tasks">No tasks available</p> // Optional empty state message
        )}
      </div>
    </div>
  );
};

export default TaskList;
