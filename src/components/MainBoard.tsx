import { useState } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { Task, boardType } from "../types";

const TODO_LIST = JSON.parse(
  localStorage.getItem("todo_list") ??
    JSON.stringify([{ task: "1", status: "todo", id: 1 }])
);
const DONE_LIST = JSON.parse(
  localStorage.getItem("done_list") ??
    JSON.stringify([{ task: "1", status: "done", id: 1 }])
);

export default function MainBoard() {
  const [todoTasks, setTodoTasks] = useState(TODO_LIST);
  const [doneTasks, setDoneTasks] = useState(DONE_LIST);

  //   const [tasks, setTasks] = useState(KANBAN_TODO);

  const addTask = (task: string, boardType: boardType, taskId?: string) => {
    const newTask = {
      task: task,
      status: boardType,
      id: taskId || uuidv4(),
    };
    // const newList = [...tasks, newTask];
    // setTasks(newList);
    if (boardType === "todo") {
      setTodoTasks([...todoTasks, newTask]);
      localStorage.setItem(
        "todo_list",
        JSON.stringify([...todoTasks, newTask])
      );
    } else {
      setDoneTasks([...doneTasks, newTask]);
      localStorage.setItem(
        "done_list",
        JSON.stringify([...doneTasks, newTask])
      );
    }
  };

  const updateTaskValue = (
    taskId: string,
    newValue: string,
    boardType: boardType
  ) => {
    if (boardType === "todo") {
      setTaskValue(setTodoTasks, todoTasks, taskId, newValue, "todo_list");
    } else {
      setTaskValue(setDoneTasks, doneTasks, taskId, newValue, "done_list");
    }
  };

  const setTaskValue = (
    taskSetter: React.Dispatch<React.SetStateAction<Task[]>>,
    tasks: Task[],
    taskId: string,
    newValue: string,
    storageKey: string
  ) => {
    const newList = tasks.map((task: Task) => {
      if (task.id === taskId) {
        return { ...task, task: newValue };
      }
      return task;
    });
    taskSetter(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };

  const updateTaskStatus = (
    task: string,
    taskId: string,
    newBoardType: boardType
  ) => {
    if (newBoardType === "todo") {
      addTask(task, newBoardType, taskId);
      deleteTask(taskId, "done");
    } else {
      addTask(task, newBoardType, taskId);
      deleteTask(taskId, "todo");
    }
  };

  const deleteTask = (taskId: string, boardType: boardType) => {
    if (boardType === "todo") {
      const updatedTasks: Task[] = todoTasks.filter(
        (task: Task) => task.id !== taskId
      );
      setTodoTasks(updatedTasks);
      localStorage.setItem("todo_list", JSON.stringify(updatedTasks));
    } else {
      const updatedTasks: Task[] = doneTasks.filter(
        (task: Task) => task.id !== taskId
      );
      setDoneTasks(updatedTasks);
      localStorage.setItem("done_list", JSON.stringify(updatedTasks));
    }
  };

  return (
    <>
      <Box className="flex flex-col">
        <Typography variant="h4" className="text-center">
          To Do
        </Typography>
        <TaskBoard
          tasks={todoTasks}
          deleteTask={deleteTask}
          updateTaskValue={updateTaskValue}
          updateTaskStatus={updateTaskStatus}
          addTask={addTask}
          boardType="todo"
        ></TaskBoard>
      </Box>
      <Box className="flex flex-col">
        <Typography variant="h4" className="text-center">
          Done
        </Typography>
        <TaskBoard
          tasks={doneTasks}
          deleteTask={deleteTask}
          updateTaskValue={updateTaskValue}
          updateTaskStatus={updateTaskStatus}
          addTask={addTask}
          boardType="done"
        ></TaskBoard>
      </Box>
    </>
  );
}
