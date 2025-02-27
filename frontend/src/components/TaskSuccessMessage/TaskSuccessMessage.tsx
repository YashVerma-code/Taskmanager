import React from 'react';
import { Check } from 'lucide-react'; 
import "./tasksuccessmssg.css"
interface TaskSuccessMessageProps {
  onBack: () => void;
  mssg?:string;
}

const TaskSuccessMessage: React.FC<TaskSuccessMessageProps> = ({ onBack ,mssg}) => {
  return (
    <div className="success-message-container">
      <div className="success-card">
        <div className="icon-wrapper">
          <Check className="check-icon" size={40} />
        </div>
        <p className="success-text">{mssg}</p>
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default TaskSuccessMessage;
