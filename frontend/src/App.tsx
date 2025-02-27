import "./App.css";
import { TaskItemType } from "./types/TaskItem";
import TaskSummaryCard from "./components/TaskSummaryCard/TaskSummaryCard";
import Navbar from "./components/Navbar/Navbar";
import Button from "./components/Button/Button";
import TaskList from "./components/TaskList/TaskList";
import TaskForm from "./components/TaskForm/TaskForm";
import { useEffect, useState } from "react";
import TaskSuccessMessage from "./components/TaskSuccessMessage/TaskSuccessMessage";

// const taskItems: TaskItemType[] = [
//   {
//     title: "Test",
//     description:
//       "Learn Maths chapter 2 Lorem njnmo,  eneubewc wc ewknewejc ewc ewcnewc ewn cewmcew cne cemcew c ",
//     priority: "high",
//     deadline: new Date(""),
//     status: "to-do",
//   },
//   {
//     title: "Test",
//     description: "Learn Maths chapter 2",
//     priority: "low",
//     deadline: new Date(),
//     status: "done",
//   },
//   {
//     title: "Test",
//     description: "Learn Maths chapter 2",
//     priority: "completed",
//     deadline: new Date(),
//     status: "on-progress",
//   },
// ];

// const taskItems2: TaskItemType[] = [
//   {
//     title: "Test",
//     description:
//       "Learn Maths chapter 2 Lorem njnmo,  eneubewc wc ewknewejc ewc ewcnewc ewn cewmcew cne cemcew c ",
//     priority: "high",
//     deadline: new Date(),
//     status: "to-do",
//   },
// ];

function App() {
  const [toastStatus, setToastStatus] = useState<boolean>(false);
  const [toastMssg, setToastMssg] = useState<string>();
  const [taskFormStatus, setTaskFormStatus] = useState<boolean>(false);
  const [todoTasks, setTodoTasks] = useState<TaskItemType[]>([]);
  const [completedTasks, setcompletedTasks] = useState<TaskItemType[]>([]);
  const [ongoingTasks, setOngoingTasks] = useState<TaskItemType[]>([]);
  const [expiredTasks, setExpiredTasks] = useState<TaskItemType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Internal Server error while loading tasks."
          );
        }
    
        const tasks = await response.json();
        if (!tasks?.tasks) {
          throw new Error("There are no tasks in the database.");
        }
    
        // Clear existing state
        setcompletedTasks([]);
        setOngoingTasks([]);
        setTodoTasks([]);
        setExpiredTasks([]); // Include expired
    
        // Process and group tasks
        const todo: TaskItemType[] = [];
        const ongoing: TaskItemType[] = [];
        const completed: TaskItemType[] = [];
        const expired: TaskItemType[] = [];
    
        tasks.tasks.forEach((task: TaskItemType) => {
          switch (task.status) {
            case "done":
              completed.push(task);
              break;
            case "on-progress":
              ongoing.push(task);
              break;
            case "to-do":
              todo.push(task);
              break;
            case "time-out":
              expired.push(task);
              break;
          }
        });
    
        setcompletedTasks(completed);
        setOngoingTasks(ongoing);
        setTodoTasks(todo);
        setExpiredTasks(expired); // Set expired directly here
      } catch (error) {
        console.log("Error: ", error);
        setToastMssg("Error Occurred while fetching the tasks");
        setToastStatus(true);
        setcompletedTasks([]);
        setOngoingTasks([]);
        setTodoTasks([]);
        setExpiredTasks([]);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <Navbar />
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
        <TaskList header="on-progress" taskItems={ongoingTasks} />
        <TaskList header="done" taskItems={completedTasks} />
      </div>
      {taskFormStatus && (
        <TaskForm
          onClose={() => setTaskFormStatus(false)}
          toastStaus={() => setToastStatus(true)}
          setToastMssg={(mssg) => setToastMssg(mssg)}
        />
      )}
      {toastStatus && toastMssg && (
        <TaskSuccessMessage
          onBack={() => setToastStatus(false)}
          mssg={toastMssg}
        />
      )}
    </div>
  );
}

export default App;
