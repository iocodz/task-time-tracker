import React, { useEffect, useState } from "react";
import Head from "next/head";
import useTimer from "../hooks/useTimer";
import secondsToHHMMSS from "../DateUtils";

const TimerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

function TaskOpen({
  id,
  title,
  handleStop,
  handleStart,
  handleDone,
  running,
  totalTime,
}) {
  return (
    <div className="flex mb-4 items-center">
      <p className="w-full font-semibold">
        <span className="mr-2">{title}</span>
        {running ? (
          <small className="text-green-500 font-semibold">running</small>
        ) : (
          <small className="text-gray-400 font-semibold">
            {secondsToHHMMSS(totalTime)}
          </small>
        )}
      </p>
      {running ? (
        <button
          className="p-2 ml-4 mr-2 border-2 rounded text-red-500 border-red-500 hover:text-white hover:bg-red-500"
          onClick={() => handleStop(id)}
        >
          <TimerIcon />
        </button>
      ) : (
        <button
          className="p-2 ml-4 mr-2 border-2 rounded text-blue-500 border-blue-500 hover:text-white hover:bg-blue-500"
          onClick={() => handleStart(id)}
        >
          <TimerIcon />
        </button>
      )}
      <button
        onClick={() => handleDone(id)}
        className="p-2 ml-2 border-2 rounded text-green-500 border-green-500 hover:text-white hover:bg-green-500"
      >
        <CheckIcon />
      </button>
    </div>
  );
}

function TaskClosed({ title, totalTime }) {
  return (
    <div className="flex mb-4 items-center">
      <p className="text w-full font-semibold">
        <span className="line-through mr-2">{title}</span>
        <small className="text-gray-400 font-light">
          {secondsToHHMMSS(totalTime)}
        </small>
      </p>
    </div>
  );
}

function Home() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const { seconds } = useTimer(currentTask);

  useEffect(() => {
    const ts = JSON.parse(localStorage.getItem("tasks")) || [];

    setTasks(ts);
  }, []);

  const updateStore = (newTaks) => {
    localStorage.setItem("tasks", JSON.stringify(newTaks));
  };

  const updateTask = (id, field, value) => {
    const updatedTasks = tasks.map((item) => {
      if (item.id == id) {
        item[field] = value;
        return item;
      }
      return item;
    });

    updateStore(updatedTasks);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    if (currentTask !== null && seconds % 5 == 0)
      updateTask(currentTask.id, "totalTime", seconds);
  }, [seconds]);

  const addTask = (e) => {
    e.preventDefault();

    const task = e.target[0].value;

    if (!task) return;

    e.target[0].value = "";

    const newTask = {
      id: tasks.length,
      title: task,
      status: "open",
      totalTime: 0,
    };

    const newTasks = [...tasks, newTask];

    setTasks(newTasks);

    updateStore(newTasks);
  };

  const handleStart = (id) => {
    setCurrentTask(tasks[id]);
  };

  const handleStop = (id) => {
    updateTask(id, "totalTime", seconds);

    setCurrentTask(null);
  };

  const handleDone = (id) => {
    updateTask(id, "status", "closed");

    console.log("asdasd");

    if (currentTask !== null && currentTask.id === id) setCurrentTask(null);
  };

  return (
    <React.Fragment>
      <Head>
        <title>Task Time Tracker</title>
      </Head>
      <div className="bg-gray-50 text-black dark:bg-black dark:text-white min-h-[100vh] w-full flex items-center justify-center font-sans">
        <div className="p-6 m-4 w-full lg:w-3/4 lg:max-w-2xl">
          <div className="mb-4">
            <h1 className="text-3xl font-semibold flex justify-between">
              Task List <span>{secondsToHHMMSS(seconds)}</span>
            </h1>
            <form className="flex mt-4" method="POST" onSubmit={addTask}>
              <input
                className="text-gray-900 border-gray-300 border-2 dark:border-0 rounded appearance-none w-full py-2 px-3 mr-4"
                placeholder="Add Task"
                autoFocus={true}
              />
              <button
                type="submit"
                className="flex-no-shrink p-2 border-2 rounded border-green-500 text-white bg-green-500"
              >
                <AddIcon />
              </button>
            </form>
          </div>
          <div className="ml-1">
            {tasks
              .filter((item) => item.status == "open")
              .map((item) => (
                <TaskOpen
                  key={item.id}
                  {...item}
                  handleStart={handleStart}
                  handleStop={handleStop}
                  handleDone={handleDone}
                  running={currentTask == item}
                />
              ))}
          </div>
          <div className="ml-1">
            {tasks
              .filter((item) => item.status == "closed")
              .map((item) => (
                <TaskClosed key={item.id} {...item} />
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
