import React from "react";
import "./expiredtaskmodal.css";
import "../TaskList/tasklist.css";
import { TaskListProps } from "@/types/TaskListProps";
import TaskItem from "../TaskItem/TaskItem";

const ExpiredtaskModal: React.FC<TaskListProps> = ({
  header,
  taskItems,
  onClose,
}) => {
  return (
    <div className="expiredTask-container" onClick={onClose}>
      <div className="content-expired">
        <div
          className="expiredTask-card"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className={`tasklist-header ${
              header === "to-do"
                ? "todoborder"
                : header === "on-progress"
                ? "onprogressborder"
                : header === "done"
                ? "doneborder"
                : header === "Expired-Task"
                ? "expiresTaskborder"
                : " "
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
                    : header === "Expired-Task"
                    ? "expiresTask"
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
                  : header === "Expired-Task"
                  ? "Expired Task"
                  : ""}
              </h2>
            </div>
            <div className="tasklist-number">
              {taskItems.length > 0 ? taskItems.length : "0"}
            </div>
          </div>
          <div className="taksitems-card expiredtaskitems-card">
            {taskItems.length > 0 ? (
              taskItems.map((taskitem, index) => (
                <div key={index}>
                  <TaskItem taskitem={taskitem} />
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredtaskModal;
