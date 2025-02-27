import React, { useEffect, useState } from "react";
import "../TaskForm/TaskForm.css";
import { TaskItemType } from "../../types/TaskItem";
import DatePickerCalendar from "../Calendar/DatePickerCalendar";

interface TaskFormProp {
  onClose: () => void;
  taskItem:TaskItemType;
  toastStaus:()=>void;
  setToastMssg:(mssg:string)=>void;
}
const RescheduleTask: React.FC<TaskFormProp> = ({ onClose,taskItem,toastStaus,setToastMssg }) => {
  const [calendarStatus,setCalendarStatus]=useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [updatedTask, setUpdatedTask] = useState<TaskItemType>({
    title:taskItem.title,
    description: taskItem.description,
    priority: taskItem.priority,
    deadline: taskItem.deadline,
    status: taskItem.status,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Rescheduled Task:", updatedTask);
   
    const sucessMssg="Added new task";
    toastStaus();
    setToastMssg(sucessMssg);
    onClose();
  };

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onClose();

    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);

  return (
    <>
    {
      calendarStatus && (
        <DatePickerCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} closeCalendar={()=>setCalendarStatus(false)}/>
      )
    }
      <div
        className="taskform-container"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="task-card">
          <div className="task-header">
            <div className="task-header-inside">
              <span className="task-dot"></span>
              <h2 className="taskform-title">Reschedule Task</h2>
            </div>
            <span className="task-add">+</span>
          </div>
          <form onSubmit={handleSubmit} className="form-control">
            <input
              type="text"
              name="title"
              value={updatedTask.title}
              onChange={handleChange}
              placeholder={updatedTask.title}
              className="input-text-field"
              required
            />
            <textarea
              name="description"
              value={updatedTask.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="textarea-field"
              required
            />
            <div className="priority-container">
              <label htmlFor="priority">Priority :</label>
              <select
                id="priority"
                name="priority"
                value={updatedTask.priority}
                onChange={handleChange}
                className="priority-control"
                required
              >
                <option disabled value={""}>Select priority</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="btns-container">
              <button type="button" className="deadline-button taskform-btn" onClick={()=>setCalendarStatus(true)}>
                Deadline
              </button>
              <button type="submit" className="submit-button taskform-btn">
                Assigned to
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RescheduleTask;
