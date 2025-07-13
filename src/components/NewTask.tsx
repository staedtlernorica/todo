import { useState, useRef } from "react";
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

  return (
    <Box className="pt-3 w-full bg-gray-100 flex justify-center items-center">
      <div className="relative">
        <TextField
          className="w-[45vw]"
          variant="standard"
          placeholder="Add task"
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <Button
          className="absolute left-full ml-[15px] h-10 w-10 min-w-0 rounded-full"
          variant="contained"
          onClick={handleAddTask}
        >
          <AddTaskIcon />
        </Button>
      </div>
    </Box>
  );
}
