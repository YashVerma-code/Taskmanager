import React from "react";
import "./button.css";

interface ButtonProp{
  onClick:()=>void;
}
const Button: React.FC<ButtonProp> = ({onClick}) => {
  return (
    <div className="btn-container">
      <button className="btn" onClick={onClick}>
        <span className="btn-icon">
          <img src="/icons/plus.png" alt="p" />
        </span>
        <span className="btn-text">Add Task</span>
      </button>
    </div>
  );
};

export default Button;
