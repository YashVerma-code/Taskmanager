import React, { useState } from "react";
import "./tasksummarycard.css";
import { TaskSummaryCardProps } from "../../types/TaskSummaryCardProps";

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({
  icon,
  title,
  count,
  total,
  color,
  onClickEvent,
  onClose
}) => {
  const [value,setValue]=useState<boolean>(false)
  return (
    <div className="task-summary-card" onClick={onClickEvent}>
      <div className="task-icon" style={{ backgroundColor: color }} onClick={()=>setValue(!value)}>
        <img src={icon} alt="warning" />
      </div>
      <div className={`task-details ${value?"show":""}`}>
        <p className="task-title">{title}</p>
        <p className="task-count">
          {count}
          {total !== undefined && <span className="task-total">/{total}</span>}
        </p>
      </div>
    </div>
  );
};

export default TaskSummaryCard;
