import React, { useState } from "react";
import "./TaskItem.css";
import { TaskItemType } from "../../types/TaskItem";
import TaskDropdownMenu from "../TaskDropdownMenu/TaskDropdownMenu";
import RescheduleTask from "../RescheduleTask/RescheduleTask";
import TaskSuccessMessage from "../TaskSuccessMessage/TaskSuccessMessage";

const TaskItem: React.FC<{ taskitem: TaskItemType }> = ({ taskitem }) => {
  const [toastStatus, setToastStatus] = useState<boolean>(false);
  const [toastMssg, setToastMssg] = useState<string>();
  const { title, description, deadline, priority, status } = taskitem;
  const [rescheduleTask, setRescheduleTask] = useState<boolean>();
  return (
    <>
      <div className="taskItem-card">
        <div className="taskItem-card-content">
          {priority && (
            <div className="priority">
              <div className={`priority-content priority-content-${priority}`}>
                {priority}
              </div>
              <div className="options">
                <TaskDropdownMenu
                  onEdit={() => {
                    setRescheduleTask(true);
                  }}
                  onRemove={() => console.log("Remove Task")}
                  taskItem={taskitem}
                />
              </div>
            </div>
          )}

          <div className="title">{title}</div>

          {description && <div className="description">{description}</div>}

          {deadline && (
            <div className="deadline">
              <span>Deadline:</span> {new Date(deadline).toLocaleDateString()}
            </div>
          )}
          {rescheduleTask && (
            <RescheduleTask
              onClose={() => setRescheduleTask(false)}
              taskItem={taskitem}
               toastStaus={()=>setToastStatus(true)} setToastMssg={(mssg)=>setToastMssg(mssg)}
            />
          )}
        </div>
      </div>
      {toastStatus && toastMssg && (
        <TaskSuccessMessage
          onBack={() => setToastStatus(false)}
          mssg={toastMssg}
        />
      )}
    </>
  );
};

export default TaskItem;
