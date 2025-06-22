import Task from "./Task";
import NewTask from "./NewTask";
import { Box, Divider } from "@mui/material";
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
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task.task}
            taskId={task.id}
            status={task.status}
            deleteTask={deleteTask}
            updateTaskValue={updateTaskValue}
            updateTaskStatus={updateTaskStatus}
          />
        ))}
        {/* MUI style > Tailwind for Divider margin */}
        <Divider variant="middle" sx={{ my: 4 }} />

        <NewTask addTask={addTask} boardType={boardType}></NewTask>
      </Box>
    </>
  );
}
