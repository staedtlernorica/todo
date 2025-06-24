import { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    if (didJustAddTask.current) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      didJustAddTask.current = false;
    }
  });

  return (
    <Box className="flex justify-center items-center sticky bottom-17 bg-white mt-4">
      <TextField
        variant="filled"
        placeholder="Add new task"
        value={newTask}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ margin: "10px 0" }}
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
