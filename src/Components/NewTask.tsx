import { useState } from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';

export default function NewTask({ addTask, boardType }) {

    const [newTask, setNewTask] = useState('');

    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    };

    const handleAddTask = () => {
        if (newTask.trim() !== '') {
            addTask(newTask, boardType);
            setNewTask(''); // Clear the input field after adding
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    return (
        <>
            <Box
                className="flex justify-center">
                <TextField
                    variant="filled"
                    placeholder="Add new task"
                    value={newTask}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    style={{ margin: '10px 0' }}
                />
                <Button variant="contained" onClick={handleAddTask}>
                    Add Task
                </Button>
            </Box>
        </>
    )
}