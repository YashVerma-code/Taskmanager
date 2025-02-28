import "./App.css";
import { useEffect, useState } from "react";
import { useTasks } from "./context/TaskContext";
import TaskSummaryCard from "./components/TaskSummaryCard/TaskSummaryCard";
import Navbar from "./components/Navbar/Navbar";
import Button from "./components/Button/Button";
import TaskList from "./components/TaskList/TaskList";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskSuccessMessage from "./components/TaskSuccessMessage/TaskSuccessMessage";
function App() {
  const [toastStatus, setToastStatus] = useState<boolean>(false);
  const [toastMssg, setToastMssg] = useState<string>();
  const [taskFormStatus, setTaskFormStatus] = useState<boolean>(false);
  const { todoTasks, ongoingTasks, completedTasks, expiredTasks, fetchTasks} = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <Navbar  onSearch={(query) => {
    console.log("Searching for:", query);
    // Call your search/filter function here
  }}
  onFilterClick={() => {
    console.log("Open filter modal");
    // Open your filter UI here
  }} />
      <div className="left-sidebar">
        <TaskSummaryCard
          icon="/icons/warning.png"
          title="Expired Tasks"
          count={expiredTasks.length}
          color="rgba(244, 45, 32, 1)"
        />
        <TaskSummaryCard
          icon="/icons/activeTab.png"
          title="All active Tasks"
          count={todoTasks.length + ongoingTasks.length}
          color="rgba(232, 146, 113, 1)"
        />
        <TaskSummaryCard
          icon="/icons/clock.png"
          title="Completed Tasks"
          count={completedTasks.length}
          total={todoTasks.length + ongoingTasks.length + completedTasks.length}
          color="rgba(112, 161, 229, 1)"
        />
        <div className="btn-container">
          <Button onClick={() => setTaskFormStatus(true)} />
        </div>
      </div>
      <div className="task-container">
        <TaskList header="to-do" taskItems={todoTasks} />
        <TaskList header="on-progress" taskItems={ongoingTasks}  />
        <TaskList header="done" taskItems={completedTasks} />
      </div>
      {taskFormStatus && (
        <TaskForm
          onClose={() => setTaskFormStatus(false)}
          toastStaus={() => setToastStatus(true)}
          setToastMssg={(mssg) => setToastMssg(mssg)}
          refreshTasks={fetchTasks}
        />
      )}
      {toastStatus && toastMssg && (
        <TaskSuccessMessage
          onBack={() => setToastStatus(false)}
          mssg={toastMssg}
        />
      )}
      {/* <div className="task-container">Active Card: {activeCard?._id}</div> */}
    </div>
  );
}

export default App;
