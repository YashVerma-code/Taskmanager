import React, { useState } from "react";
import "./TaskItem.css";
import { TaskItemType } from "../../types/TaskItem";
import TaskDropdownMenu from "../TaskDropdownMenu/TaskDropdownMenu";
import RescheduleTask from "../RescheduleTask/RescheduleTask";
import TaskSuccessMessage from "../TaskSuccessMessage/TaskSuccessMessage";
import { useTasks } from "@/context/TaskContext";

const TaskItem: React.FC<{ taskitem: TaskItemType }> = ({ taskitem }) => {
  const [toastStatus, setToastStatus] = useState<boolean>(false);
  const [toastMssg, setToastMssg] = useState<string>();
  const { title, description, deadline, priority } = taskitem;
  const [rescheduleTask, setRescheduleTask] = useState<boolean>();
  const {fetchTasks ,setActiveCard} = useTasks();
  return (
    <>
      <div className="taskItem-card" draggable={priority !== "completed"} onDragStart={()=>setActiveCard(taskitem)} onDragEnd={()=>setActiveCard(undefined)}>
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
                  refreshTasks={()=>fetchTasks(`${localStorage.getItem('token')}`)}
                  taskItem={taskitem}
                />
              </div>
            </div>
          )}

          <div className="title-task">{title}</div>

          {description && <div className="description">{description}</div>}

          {deadline && (
            <div className="deadline">
              <span className="deadline-title">Deadline :{" "}</span> 
              <span className="deadline-date">{new Date(deadline).toLocaleDateString('en-GB').split("/").join("-")}</span>
            </div>
          )}
          
        </div>
      </div>
      {toastStatus && toastMssg && (
        <TaskSuccessMessage
          onBack={() => setToastStatus(false)}
          mssg={toastMssg}
        />
      )}
      {rescheduleTask && (
            <RescheduleTask
              onClose={() => setRescheduleTask(false)}
              taskItem={taskitem}
               toastStaus={()=>setToastStatus(true)} setToastMssg={(mssg)=>setToastMssg(mssg)}
               refreshTasks={()=>fetchTasks(localStorage.getItem('token')||"")}
            />
          )}
    </>
  );
};

export default TaskItem;
