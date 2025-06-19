import Task from "./Task"
import NewTask from "./NewTask"
import { Box, Divider } from "@mui/material"

export default function TaskBoard({ tasks, addTask, deleteTask, updateTask, toggleTaskStatus, boardType }) {
    return (
        <>
            <Box className="flex flex-col">
                {
                    tasks.map((task, index) => (
                        <Task
                            key={task.id}
                            task={task.task}
                            taskId={task.id}
                            status={task.status}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            toggleTaskStatus={toggleTaskStatus}
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