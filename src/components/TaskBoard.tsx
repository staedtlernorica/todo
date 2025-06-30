import Task from "./Task";
import NewTask from "./NewTask";
import { Box } from "@mui/material";
import type { TaskBoardProps } from "../types";

export default function TaskBoard({
  tasks,
  addTask,
  deleteTask,
  updateTaskValue,
  updateTaskStatus,
  boardType,
}: TaskBoardProps) {
  return (
    <>
      <Box className="flex flex-col">
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
      <NewTask addTask={addTask} boardType={boardType}></NewTask>
    </>
  );
}
