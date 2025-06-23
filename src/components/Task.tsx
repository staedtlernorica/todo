import { Box, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import RedoIcon from "@mui/icons-material/Redo";
import { useState, useEffect } from "react";
import type { TaskProps, InputChangeEvent } from "../types";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import React from "react";

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

  const [taskVisibility, setTaskVisibility] = useState(true);
  const [delTransitionTiming, setDelTransitionTiming] = useState(0);
  const handleDelete = () => {
    setTaskVisibility(false);
    setDelTransitionTiming(300);
  };

  const containerRef = React.useRef<HTMLElement>(null);

  const [switchVisibility, setSwitchVisibility] = useState(true);
  const [switchTiming, setSwitchTiming] = useState(0);

  const handleSwitch = () => {
    setSwitchVisibility(false);
    setSwitchTiming(300);
  };

  return (
    <Box ref={containerRef}>
      <Slide
        in={switchVisibility}
        mountOnEnter
        unmountOnExit
        timeout={switchTiming}
        direction={taskStatus === "done" ? "left" : "right"}
        container={containerRef.current}
        onExited={() => handleStatusChange}
      >
        <Fade
          in={taskVisibility}
          mountOnEnter
          unmountOnExit
          timeout={delTransitionTiming}
          onExited={() => deleteTask(taskId, taskStatus)}
        >
          <Box className="flex align-items-center">
            {taskInput(handleInputChange, taskValue)}
            {taskSwitch(handleSwitch, taskStatus)}
            {taskDelete(handleDelete)}
          </Box>
        </Fade>
      </Slide>
    </Box>
  );
}

function taskInput(
  handleInputChange: (e: InputChangeEvent) => void,
  taskValue: string
) {
  return (
    <TextField
      className="m-3"
      variant="standard"
      value={taskValue}
      onChange={handleInputChange}
      style={{ margin: "10px 0" }}
    />
  );
}
function taskSwitch(
  handleSwitch: React.MouseEventHandler<HTMLButtonElement> | undefined,
  taskStatus: string
) {
  return (
    <Button className="m-3" variant="contained" onClick={handleSwitch}>
      {taskStatus == "done" ? <RedoIcon></RedoIcon> : <DoneIcon></DoneIcon>}
    </Button>
  );
}
function taskDelete(handleDelete: () => void) {
  return (
    <Button className="m-3" variant="contained" onClick={handleDelete}>
      <DeleteIcon className="p-0" />
    </Button>
  );
}
