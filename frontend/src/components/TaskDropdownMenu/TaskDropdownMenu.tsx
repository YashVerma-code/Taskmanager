import { TaskItemType } from "@/types/TaskItem";
import "./taskdropdownmenu.css";
import { Ellipsis } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface TaskDropdownMenuProps {
  onEdit: () => void;
  taskItem: TaskItemType;
  refreshTasks:()=>void
}

const TaskDropdownMenu: React.FC<TaskDropdownMenuProps> = ({
  onEdit,
  refreshTasks,
  taskItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    // console.log("Input: ", taskItem);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${taskItem._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskItem),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      console.log("Response: ", response);
      // setToastMssg("Task added successfully!");
      refreshTasks();
    } catch (error) {
      console.error("Error", error);
      // setToastMssg("Error occurred while adding task");
    } finally {
      // setIsSubmitting(false);
      setIsDeleting(false)
    }
    // toastStaus();
    // onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="task-dropdown" ref={menuRef}>
      <button className="dropdown-toggle-btn" onClick={toggleMenu}>
        <Ellipsis size={20} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={onEdit} className="dropdown-item">
            Edit
          </button>
          <form onSubmit={handleSubmit}>
            <button type="submit" className="dropdown-item">
             {isDeleting ?"Removing...":"Remove"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskDropdownMenu;
