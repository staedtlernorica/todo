import { Box, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import RedoIcon from "@mui/icons-material/Redo";
import { useState } from "react";
import type { TaskProps, InputChangeEvent } from "../types";

export default function Task({
  task,
  taskId,
  status,
  deleteTask,
  updateTaskValue,
  updateTaskStatus,
}: TaskProps) {
  const [taskValue, setTaskValue] = useState(task);
  const [taskStatus, setTaskStatus] = useState(status);
  const handleInputChange = (e: InputChangeEvent) => {
    setTaskValue(e.target.value);
    updateTaskValue(taskId, e.target.value, status); // Call the parent's setInputValue
  };
  const handleStatusChange = () => {
    const newStatus = taskStatus === "done" ? "todo" : "done";
    setTaskStatus(newStatus);
    updateTaskStatus(taskValue, taskId, newStatus); // Use the updated status directly
  };

  return (
    <>
      <Box className="flex align-items-center">
        <TextField
          className="m-3"
          variant="standard"
          value={taskValue}
          onChange={handleInputChange}
          style={{ margin: "10px 0" }}
        />
        <Button
          className="m-3"
          variant="contained"
          onClick={handleStatusChange}
        >
          {taskStatus == "done" ? <RedoIcon></RedoIcon> : <DoneIcon></DoneIcon>}
        </Button>
        <Button
          className="m-3"
          variant="contained"
          onClick={() => deleteTask(taskId, taskStatus)}
        >
          <DeleteIcon className="p-0" />
        </Button>
      </Box>
    </>
  );
}
