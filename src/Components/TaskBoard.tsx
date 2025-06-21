import Task from "./Task"
import NewTask from "./NewTask"
import { Box, Divider } from "@mui/material"

type TaskType = {
    id: string;
    task: string;
    status: boardType;
};

type TaskBoardProps = {
    tasks: TaskType[];
    addTask: (task: string, boardType: boardType) => void;
    deleteTask: (taskId: string) => void;
    updateTask: (taskId: string, newValue: string, boardType: boardType) => void;
    boardType: boardType;
};

type boardType = "todo" | "done";

export default function TaskBoard({ tasks, addTask, deleteTask, updateTask, boardType }: TaskBoardProps) {
    return (
        <>
            <Box className="flex flex-col">
                {
                    tasks.map((task) => (
                        <Task
                            key={task.id}
                            task={task.task}
                            taskId={task.id}
                            status={task.status}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))
                }
                {/* MUI style > Tailwind for Divider margin */}
                <Divider variant="middle" sx={{ my: 4 }} />

                <NewTask
                    addTask={addTask}
                    boardType={boardType}>
                </NewTask>
            </Box>
        </>
    )
}