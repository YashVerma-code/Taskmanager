import { TaskItemType } from "@/types/TaskItem";
import "./taskdropdownmenu.css";
import { Ellipsis } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface TaskDropdownMenuProps {
  onEdit: () => void;
  onRemove: () => void;
  taskItem: TaskItemType;
}

const TaskDropdownMenu: React.FC<TaskDropdownMenuProps> = ({
  onEdit,
  // onRemove,
  // taskItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

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
          <form action={``}>
            <button type="submit" className="dropdown-item">
              Remove
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskDropdownMenu;
