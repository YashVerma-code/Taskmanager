import "./App.css";
import { TaskItemType } from "./types/TaskItem";
import TaskSummaryCard from "./components/TaskSummaryCard/TaskSummaryCard";
import Navbar from "./components/Navbar/Navbar";
import Button from "./components/Button/Button";
import TaskList from "./components/TaskList/TaskList";
import TaskForm from "./components/TaskForm/TaskForm";
import { useState } from "react";
import TaskSuccessMessage from "./components/TaskSuccessMessage/TaskSuccessMessage";

const taskItems: TaskItemType[] = [
  {
    title: "Test",
    description:
      "Learn Maths chapter 2 Lorem njnmo,  eneubewc wc ewknewejc ewc ewcnewc ewn cewmcew cne cemcew c ",
    priority: "high",
    deadline: new Date(""),
    status: "to-do",
  },
  {
    title: "Test",
    description: "Learn Maths chapter 2",
    priority: "low",
    deadline: new Date(),
    status: "done",
  },
  {
    title: "Test",
    description: "Learn Maths chapter 2",
    priority: "completed",
    deadline: new Date(),
    status: "on-progress",
  },
];

const taskItems2: TaskItemType[] = [
  {
    title: "Test",
    description:
      "Learn Maths chapter 2 Lorem njnmo,  eneubewc wc ewknewejc ewc ewcnewc ewn cewmcew cne cemcew c ",
    priority: "high",
    deadline: new Date(),
    status: "to-do",
  },
  
];

function App() {
  const [toastStatus,setToastStatus]=useState<boolean>(false);
  const [toastMssg,setToastMssg]=useState<string>();
  const [taskFormStatus,setTaskFormStatus]=useState<boolean>(false);

  return (
    <div className="container">
      <Navbar />
      <div className="left-sidebar">
        <TaskSummaryCard
          icon="/icons/warning.png"
          title="Expired Tasks"
          count={5}
          color="rgba(244, 45, 32, 1)"
        />
        <TaskSummaryCard
          icon="/icons/activeTab.png"
          title="All active Tasks"
          count={7}
          color="rgba(232, 146, 113, 1)"
        />
        <TaskSummaryCard
          icon="/icons/warning.png"
          title="Expired Tasks"
          count={2}
          total={7}
          color="rgba(112, 161, 229, 1)"
        />
        <div className="btn-container">
          <Button onClick={()=>setTaskFormStatus(true)}/>
        </div>
      </div>
      <div className="task-container">
        <TaskList header="to-do" taskItems={taskItems}/>
        <TaskList header="on-progress" taskItems={taskItems2}/>
        <TaskList header="done" taskItems={taskItems}/>
      </div>
      {
        taskFormStatus &&(
          <TaskForm onClose={() => setTaskFormStatus(false)} toastStaus={()=>setToastStatus(true)} setToastMssg={(mssg)=>setToastMssg(mssg)}/>
        )
      }
      {
        toastStatus && toastMssg && (
          <TaskSuccessMessage onBack={()=>setToastStatus(false)} mssg={toastMssg}/>
        )
      }
    </div>
  );
}

export default App;
