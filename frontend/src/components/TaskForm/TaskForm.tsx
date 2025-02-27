import React, { useEffect, useState } from "react";
import "./TaskForm.css";
import { TaskItemType } from "../../types/TaskItem";
import DatePickerCalendar from "../Calendar/DatePickerCalendar";

interface TaskFormProp {
  onClose: () => void;
  toastStaus: () => void;
  setToastMssg: (mssg: string) => void;
}

const TaskForm: React.FC<TaskFormProp> = ({
  onClose,
  toastStaus,
  setToastMssg,
}) => {
  const [calendarStatus, setCalendarStatus] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date|null>(new Date());

  const [task, setTask] = useState<TaskItemType>({
    title: "",
    description: "",
    priority: "",
    deadline: new Date(),
    status: "to-do",
  });

  useEffect(() => {
    // Update task deadline when date changes
    setTask((prev) => ({ ...prev, deadline: selectedDate}));
  }, [selectedDate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Input: ",task)
    try {
      const response = await fetch( "http://localhost:5000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      setToastMssg("Task added successfully!");
    } catch (error) {
      console.error("Error", error);
      setToastMssg("Error occurred while adding task");
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
              <h2 className="taskform-title">ADD TASK</h2>
            </div>
            <span className="task-add">+</span>
          </div>
          <form onSubmit={handleSubmit} className="form-control">
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Task 1"
              className="input-text-field"
              required
            />
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="textarea-field"
              required
            />
            <div className="priority-container">
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="priority-control"
                required
              >
                <option disabled value="">
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
                Assigned To
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
