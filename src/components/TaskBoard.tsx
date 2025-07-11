import Task from "./Task";
import { Box } from "@mui/material";
import type { TaskBoardProps } from "../types";
import { useEffect, useRef } from "react";

export default function TaskBoard({
  tasks,
  deleteTask,
  updateTaskValue,
  updateTaskStatus,
}: TaskBoardProps) {
  const prevNumOfTasks = useRef(tasks.length);
  const thingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prevNumOfTasks.current !== 0 && prevNumOfTasks.current < tasks.length) {
      thingRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevNumOfTasks.current = tasks.length; // <-- Update ref
  }, [tasks.length]);

  return (
    <>
      <Box className="mt-6 flex flex-col px-2 pt-1 pb-1">
        {tasks.map((task, index) => (
          <Task
            index={index}
            key={task.id}
            task={task.task}
            taskId={task.id}
            status={task.status}
            deleteTask={deleteTask}
            updateTaskValue={updateTaskValue}
            updateTaskStatus={updateTaskStatus}
          />
        ))}
      </Box>

      <div ref={thingRef} />
      {/* Scroll target */}
    </>
  );
}
