import { useState } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { Task, boardType } from "../types";

const TODO_LIST = JSON.parse(
  localStorage.getItem("todo_list") ?? JSON.stringify([])
);
const DONE_LIST = JSON.parse(
  localStorage.getItem("done_list") ?? JSON.stringify([])
);

const META = JSON.parse(
  localStorage.getItem("meta") ?? JSON.stringify({ lastActiveBoard: "todo" })
);

export default function MainBoard() {
  const [todoTasks, setTodoTasks] = useState(TODO_LIST);
  const [doneTasks, setDoneTasks] = useState(DONE_LIST);
  const [activeBoard, setActiveBoard] = useState(
    META.lastActiveBoard || "todo"
  );

  const addTask = (task: string, boardType: boardType, taskId?: string) => {
    const newTask = {
      task: task,
      status: boardType,
      id: taskId || uuidv4(),
    };
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

  const switchBoard = () => {
    setActiveBoard(activeBoard === "todo" ? "done" : "todo");
  };

  return (
    <>
      <Box className="flex flex-col h-screen justify-between pt-5">
        {/* <Typography
          variant="h4"
          className="text-center sticky top-0 bg-white p-3"
        >
          Grocery List
        </Typography> */}
        {activeBoard === "todo" ? (
          <>
            <TaskBoard
              tasks={todoTasks}
              boardType="todo"
              deleteTask={deleteTask}
              updateTaskValue={updateTaskValue}
              updateTaskStatus={updateTaskStatus}
              addTask={addTask}
            ></TaskBoard>
          </>
        ) : (
          <>
            <TaskBoard
              tasks={doneTasks}
              boardType="done"
              deleteTask={deleteTask}
              updateTaskValue={updateTaskValue}
              updateTaskStatus={updateTaskStatus}
              addTask={addTask}
            ></TaskBoard>
          </>
        )}
        <Box className="sticky bottom-0 justify-self-end flex justify-center items-center mt-0 gap-2 p-4 bg-gray-100">
          <Button
            variant={activeBoard === "todo" ? "contained" : "outlined"}
            onClick={activeBoard === "done" ? switchBoard : undefined}
          >
            To Do
          </Button>
          <Button
            variant={activeBoard === "done" ? "contained" : "outlined"}
            onClick={activeBoard === "todo" ? switchBoard : undefined}
          >
            Done
          </Button>
        </Box>
      </Box>
    </>
  );
}
