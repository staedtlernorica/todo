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
  const endRef = useRef<HTMLDivElement | null>(null);
  const prevTaskCountRef = useRef<number>(tasks.length);

  // const bottomFade =
  // ("[-webkit-mask-image:linear-gradient(180deg,#000_60%,transparent)]");

  useEffect(() => {
    if (tasks.length > prevTaskCountRef.current) {
      // Only scroll if a task was added
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Update previous task count for next comparison
    prevTaskCountRef.current = tasks.length;
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
        <div ref={endRef} /> {/* Scroll target */}
      </Box>
    </>
  );
}
