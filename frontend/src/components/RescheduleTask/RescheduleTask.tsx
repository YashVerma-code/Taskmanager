import React, { useEffect, useState } from "react";
import "../TaskForm/TaskForm.css";
import { TaskItemType } from "../../types/TaskItem";
import DatePickerCalendar from "../Calendar/DatePickerCalendar";

interface TaskFormProp {
  onClose: () => void;
  taskItem: TaskItemType;
  toastStaus: () => void;
  setToastMssg: (mssg: string) => void;
  refreshTasks: () => void;
}
const RescheduleTask: React.FC<TaskFormProp> = ({
  onClose,
  taskItem,
  toastStaus,
  setToastMssg,
  refreshTasks
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [calendarStatus, setCalendarStatus] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [updatedTask, setUpdatedTask] = useState<TaskItemType>({
    title: taskItem.title,
    description: taskItem.description,
    priority: taskItem.priority,
    deadline: taskItem.deadline,
    status: taskItem.status,
    _id:taskItem._id
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

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("Rescheduled Task:", updatedTask);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskItem._id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );
      console.log("Response: ",response);
      if (!response.ok) {
        throw new Error("Failed to reschedule task due to internal error.");
      }
      setToastMssg("Task Rescheduled successfully!");
      refreshTasks();
    } catch (error) {
      console.log("Error occured due to : ", error);
      setToastMssg("Error occurred while rescheduling the  task");
    } finally {
      setIsSubmitting(false);
    }
    toastStaus();
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
      {calendarStatus && (
        <DatePickerCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          closeCalendar={() => setCalendarStatus(false)}
        />
      )}
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
                <option disabled value={""}>
                  Select priority
                </option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="btns-container">
              <button
                type="button"
                className="deadline-button taskform-btn"
                onClick={() => setCalendarStatus(true)}
              >
                Deadline: {selectedDate?.toLocaleDateString()}
              </button>
              <button type="submit" className="submit-button taskform-btn">
                {isSubmitting ? "Assigning..." : "Assigned To"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RescheduleTask;
