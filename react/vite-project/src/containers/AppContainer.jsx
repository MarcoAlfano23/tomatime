import React, { useEffect, useState } from "react";
import TaskModal from "../components/TaskModal";
import TodoSectionContainer from "./TodoSectionContainer";
import DoneSectionContainer from "./DoneSectionContainer";
import WorkingSectionContainer from "./WorkingSectionContainer";
import titlePageLogo from "../assets/titlePage.svg";
import "../index.css";
import DoneTaskCounter from "../components/DoneTaskCounter";
import Tomate from "../components/Tomate";
import SmashTomate from "../components/SmashTomate";
import Profile from "../components/Profile";

const AppContainer = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [tomateCount, setTomateCount] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("userId")); 

  useEffect(() => {
    fetch('http://localhost:3000/tasks', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }), 
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setDoneCount(data.filter((task) => task.state === "done").length);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [userId]);

  
  const addTask = (newTask) => {
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
        if (data.state === "done") {
          setDoneCount((prev) => prev + 1);
        }
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const startTask = async (taskId) => {
    try {
      const response = await fetch("http://localhost:3000/tasks/state", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, state: "workingAt" }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? { ...task, state: "workingAt" } : task));
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const response = await fetch("http://localhost:3000/tasks/state", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, state: "done" }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? { ...task, state: "done" } : task));
      setDoneCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const todoTasks = tasks.filter(task => task.state === 'to do');
  const workingTasks = tasks.filter(task => task.state === 'workingAt');
  const doneTasks = tasks.filter(task => task.state === 'done');

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={titlePageLogo} alt="App Title" />
        <div className="container-counter">
        <DoneTaskCounter doneCount={doneCount} />
        <Tomate />
        <SmashTomate />
        <Profile />
        </div>
      </header>
      <main className="content">
        <div className="task-section">
          <TodoSectionContainer tasks={todoTasks} onAddTask={addTask} onStartTask={startTask} openModal={openModal} />
        </div>
        <div className="focus-section">
          <WorkingSectionContainer tasks={workingTasks} onCompleteTask={completeTask} />
        </div>
        <div className="done-section">
          <DoneSectionContainer tasks={doneTasks} />
        </div>
      </main>
      {isModalOpen && <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={addTask} />}
    </div>
  );
};

export default AppContainer;
