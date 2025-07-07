import Task from "./Task";
import { Box } from "@mui/material";
import type { TaskBoardProps } from "../types";
import { useEffect, useRef, useState } from "react";

export default function TaskBoard({
  tasks,
  deleteTask,
  updateTaskValue,
  updateTaskStatus,
  endRef,
}: TaskBoardProps) {
  // const endRef = useRef<HTMLDivElement | null>(null);
  // const prevTaskCountRef = useRef<number>(tasks.length);
  // const mountCount = useRef(0);

  // const [canScroll, setCanScroll] = useState(false);

  // // useEffect(() => {
  // //   mountCount.current += 1;
  // //   console.log(`internal ${mountCount.current} time(s)`);
  // // }, [tasks.length]);

  // useEffect(() => {
  //   if (tasks.length > prevTaskCountRef.current && canScroll) {
  //     // Only scroll if a task was added
  //     // endRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }

  //   // Update previous task count for next comparison
  //   prevTaskCountRef.current = tasks.length;
  // }, [tasks.length]);

  // useEffect(() => {
  //   setCanScroll(true);
  // }, []);

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
        <div ref={endRef} />
        {/* Scroll target */}
      </Box>
    </>
  );
}
