import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import type { NewTaskProps, InputChangeEvent } from "../types";

export default function NewTask({ addTask, boardType }: NewTaskProps) {
  const [newTask, setNewTask] = useState("");
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
      setNewTask(""); // Clear the input field after adding
    }
  };

  return (
    <>
      <Box className="flex justify-center">
        <TextField
          variant="filled"
          placeholder="Add new task"
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ margin: "10px 0" }}
        />
        <Button variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
      </Box>
    </>
  );
}
