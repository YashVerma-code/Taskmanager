import Button from '@/components/Button/Button';
import ExpiredtaskModal from '@/components/ExpiredtaskModal/ExpiredtaskModal';
import Navbar from '@/components/Navbar/Navbar';
import TaskForm from '@/components/TaskForm/TaskForm';
import TaskList from '@/components/TaskList/TaskList';
import TaskSuccessMessage from '@/components/TaskSuccessMessage/TaskSuccessMessage';
import TaskSummaryCard from '@/components/TaskSummaryCard/TaskSummaryCard';
import { useTasks } from '@/context/TaskContext';
import React, { useEffect, useState } from 'react';
import "./home.css";
import { handleSuccess } from '@/lib/toastutil';
import { useNavigate } from 'react-router-dom';
const Home: React.FC= () => {
  const [toastStatus, setToastStatus] = useState<boolean>(false);
  const [toastMssg, setToastMssg] = useState<string>();
  const [taskFormStatus, setTaskFormStatus] = useState<boolean>(false);
  const [expiredTaskModal, setExpiredTaskModal] = useState<boolean>(false);
  const { todoTasks, ongoingTasks, completedTasks, expiredTasks, fetchTasks } =
    useTasks();

  useEffect(() => {
    fetchTasks(localStorage.getItem('token')||"");
  }, []);
  
  const navigate=useNavigate();
  return (
    <div className="container">
      <Navbar
        onSearch={(query) => {
          console.log("Searching for:", query);
          // Call your search/filter function here
        }}
        onLogOut={() => {
          handleSuccess("Successfully Logged out");
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUserEmail');
          setTimeout(()=>{
            navigate("/login")
          },1000);
          // console.log("Open filter modal");

          // Open your filter UI here
        }}
      />
      <div className="left-sidebar">
        <TaskSummaryCard
          icon="/icons/warning.png"
          title="Expired Tasks"
          count={expiredTasks.length}
          color="rgba(244, 45, 32, 1)"
          onClickEvent={() => setExpiredTaskModal(true)}
          onClose={() => setExpiredTaskModal(false)}
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
          refreshTasks={()=>fetchTasks(localStorage.getItem('token')||"")}
        />
      )}
      {toastStatus && toastMssg && (
        <TaskSuccessMessage
          onBack={() => setToastStatus(false)}
          mssg={toastMssg}
        />
      )}
      {expiredTaskModal && (
        <ExpiredtaskModal
          header="Expired-Task"
          taskItems={expiredTasks}
          onClose={() => setExpiredTaskModal(false)}
        />
      )}
      {/* <div className="task-container">Active Card: {activeCard?._id}</div> */}
    </div>
  );
};

export default Home;