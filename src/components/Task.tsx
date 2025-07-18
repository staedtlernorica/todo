import { Box, Button, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import UndoIcon from "@mui/icons-material/Undo";
import { useState } from "react";
import type { TaskProps, InputChangeEvent } from "../types";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function Task({
  index,
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
    setDelTransitionTiming(200);
  };

  const containerRef = React.useRef<HTMLElement>(null);

  const [switchVisibility, setSwitchVisibility] = useState(true);
  const [switchTiming, setSwitchTiming] = useState(0);

  const handleSwitch = () => {
    setSwitchVisibility(false);
    setSwitchTiming(250);
  };

  return (
    <Box className="" ref={containerRef}>
      <Slide
        in={switchVisibility}
        mountOnEnter
        unmountOnExit
        timeout={switchTiming}
        direction={taskStatus === "done" ? "right" : "left"}
        container={containerRef.current}
        onExited={handleStatusChange}
      >
        <Fade
          in={taskVisibility}
          mountOnEnter
          unmountOnExit
          timeout={delTransitionTiming}
          onExited={() => deleteTask(taskId, taskStatus)}
        >
          <Box className="flex items-center justify-center mx-2 mt-2">
            <Typography className="mr-3 font-bold h-6 w-6 text-center rounded-full">
              {index + 1 + ")"}
            </Typography>
            {TaskInput(handleInputChange, taskValue)}
            {TaskSwitch(handleSwitch, taskStatus)}
            {TaskDelete(handleDelete)}
          </Box>
        </Fade>
      </Slide>
    </Box>
  );
}

function TaskInput(
  handleInputChange: (e: InputChangeEvent) => void,
  taskValue: string
) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(taskValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <TextField
        className="max-w-80 flex-1"
        variant="standard"
        value={taskValue}
        onChange={handleInputChange}
        multiline
        // inputProps={{
        //   className: "m-0 p-0", // or "text-right", etc.
        // }}

        // style={{ margin: "10px 0" }}
      />
      <ContentCopyIcon
        onClick={handleCopyClick}
        className={`ml-2 h-5.5 w-5.5 cursor-pointer transition-all duration-200
          ${
            copied
              ? "text-blue-800 translate-y-[1px]"
              : "text-blue-400 hover:text-blue-600"
          }
        `}
        titleAccess={copied ? "Copied!" : "Copy to clipboard"}
      />
    </>
  );
}
function TaskSwitch(
  handleSwitch: React.MouseEventHandler<HTMLButtonElement> | undefined,
  taskStatus: string
) {
  return (
    <Button
      className="ml-3 mr-1 rounded-full h-6.5 w-6.5 min-w-0"
      variant="contained"
      onClick={handleSwitch}
      size="small"
    >
      {taskStatus == "done" ? (
        <UndoIcon className="w-5" />
      ) : (
        <DoneIcon className="w-5" />
      )}
    </Button>
  );
}
function TaskDelete(handleDelete: () => void) {
  return (
    <Button
      className=" rounded-full h-6.5 w-6.5 min-w-0"
      variant="contained"
      onClick={handleDelete}
      size="small"
    >
      <DeleteIcon className="w-5" />
    </Button>
  );
}
