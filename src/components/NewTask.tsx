import { useState, useRef } from "react";
// import { useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import type { NewTaskProps, InputChangeEvent } from "../types";
import AddTaskIcon from "@mui/icons-material/AddTask";

export default function NewTask({ addTask, boardType }: NewTaskProps) {
  const [newTask, setNewTask] = useState("");
  const didJustAddTask = useRef(false);

  const handleInputChange = (e: InputChangeEvent) => {
    setNewTask(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      addTask(newTask, boardType);
      setNewTask("");
      didJustAddTask.current = true;
    }
  };

  // useEffect(() => {
  //   if (didJustAddTask.current) {
  //     window.scrollTo({
  //       top: document.body.scrollHeight,
  //       behavior: "smooth",
  //     });
  //     didJustAddTask.current = false;
  //   }
  // }, []);

  return (
    <Box className="z-10 pt-3 w-full bg-gray-100 flex justify-center items-center">
      <TextField
        className="p0 m0"
        variant="filled"
        placeholder="Add new task"
        value={newTask}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      ></TextField>

      <Button
        className="ml-5 h-10 w-10 min-w-0"
        variant="contained"
        onClick={handleAddTask}
      >
        <AddTaskIcon />
      </Button>
    </Box>
  );
}
