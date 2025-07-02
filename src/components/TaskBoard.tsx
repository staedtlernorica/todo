import Task from "./Task";
// import NewTask from "./NewTask";
import { Box } from "@mui/material";
import type { TaskBoardProps } from "../types";
import { use, useEffect, useRef } from "react";

export default function TaskBoard({
  tasks,
  // addTask,
  deleteTask,
  updateTaskValue,
  updateTaskStatus,
}: // boardType,
TaskBoardProps) {
  // const bottomFade =
  "[-webkit-mask-image:linear-gradient(180deg,#000_60%,transparent)]";

  // const [tasks, setTasks] = useState([] as Task[]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tasks]);

  return (
    <>
      <Box className="h-[450px] min-h-0 mt-6 overflow-y-auto flex flex-col px-2 pt-1 pb-1">
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
      {/* <NewTask addTask={addTask} boardType={boardType}></NewTask> */}
    </>
  );
}
