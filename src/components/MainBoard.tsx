import { useState, } from "react";
import TaskBoard from "./TaskBoard";
import { Box, Typography } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import type { Task, boardType } from "../types";

const ALL_TASKS = [
    { task: "1", status: "todo", id: 1 },
    { task: "2", status: "todo", id: 12 },
    { task: "2", status: "todo", id: 124 },
    { task: "1", status: "done", id: 123 },]
const KANBAN_TODO = JSON.parse(localStorage.getItem('kanban_todo') ?? JSON.stringify(ALL_TASKS))

export default function MainBoard() {
    const [tasks, setTasks] = useState(KANBAN_TODO)
    const addTask = (task: string, boardType: boardType) => {
        const newTask = {
            task: task,
            status: boardType,
            id: uuidv4()
        }
        const newList = [...tasks, newTask]
        setTasks(newList)
        localStorage.setItem("kanban_todo", JSON.stringify(newList))
    }

    const updateTask = (taskId: string, newValue: string, boardType: boardType) => {
        setTasks(tasks.map((task: Task) => {
            if (task.id === taskId) {
                task.task = newValue;
                task.status = boardType;
                return task;
            }
            return task;
        }))
        localStorage.setItem("kanban_todo", JSON.stringify(tasks))
    }

    const deleteTask = (taskId: string) => {
        setTasks(() => {
            const updatedTasks: Task[] = tasks.filter((task: Task) => task.id !== taskId);
            return updatedTasks;
        });
        localStorage.setItem("kanban_todo", JSON.stringify(tasks));
    };

    return (
        <>
            <Box
                className="flex flex-col">
                <Typography variant="h4" className="text-center">
                    To Do
                </Typography>
                <TaskBoard
                    tasks={tasks.filter((task: Task) => task.status === "todo")}
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
                    tasks={tasks.filter((task: Task) => task.status === "done")}
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