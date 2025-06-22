import { Box, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
        <Button
          className="m-3 flex-1"
          variant="contained"
          onClick={handleStatusChange}
        >
          {taskStatus == "done" ? "Do again" : "Finished"}
        </Button>
        <TextField
          className="m-3 flex-8"
          variant="standard"
          value={taskValue}
          onChange={handleInputChange}
          style={{ margin: "10px 0" }}
        />
        <Button
          className="m-3 p-0 flex-1"
          variant="contained"
          onClick={() => deleteTask(taskId, taskStatus)}
        >
          <DeleteIcon className="p-0" />
        </Button>
      </Box>
    </>
  );
}
