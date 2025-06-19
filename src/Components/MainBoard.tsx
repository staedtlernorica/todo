import { useState, useEffect } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Stack, Typography } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

var ALL_TASKS = [
    { task: "1", status: "todo", id: 1 },
    { task: "2", status: "todo", id: 12 },
    { task: "2", status: "todo", id: 124 },
    { task: "1", status: "done", id: 123 },]

// localStorage.setItem("kanban_todo", JSON.stringify(ALL_TASKS))
const KANBAN_TODO = JSON.parse(localStorage.getItem('kanban_todo') ?? JSON.stringify(ALL_TASKS))

export default function MainBoard() {

    const [tasks, setTasks] = useState(KANBAN_TODO)

    const addTask = (task, boardType) => {
        const newTask = {
            task: task,
            status: boardType,
            id: uuidv4() // Generate a unique ID for the new task
        }
        setTasks(() => {
            return [...tasks, newTask];
        })

        localStorage.setItem("kanban_todo", JSON.stringify([...tasks, newTask]))
    }

    const updateTask = (taskId, newValue, boardType) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                task.task = newValue;
                task.status = boardType;
                return task;
            }
            return task;
        }))

        console.log("Updated Task", taskId, newValue, boardType)

        localStorage.setItem("kanban_todo", JSON.stringify(tasks))
    }

    const deleteTask = (taskId) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.filter(task => task.id !== taskId);
            localStorage.setItem("kanban_todo", JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    };


    return (
        <>
            <Box
                className="flex flex-col">
                <Typography variant="h4" className="text-center">
                    To Do
                </Typography>
                <TaskBoard

                    tasks={tasks.filter(task => task.status === "todo")}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    addTask={addTask}
                    boardType="todo"
                >
                </TaskBoard>

            </Box>
            <Box
                className="flex flex-col">
                <Typography variant="h4" className="text-center">
                    Done
                </Typography>
                <TaskBoard
                    tasks={tasks.filter(task => task.status === "done")}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    addTask={addTask}
                    boardType="done"
                >
                </TaskBoard>
            </Box>
        </>
    )


}