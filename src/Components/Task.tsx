import { Box, Button, TextField, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export default function Task({ task, taskId, status, deleteTask, updateTask, toggleTaskStatus }) {

    const [taskValue, setTaskValue] = useState(task)
    const [taskStatus, setTaskStatus] = useState(status)

    const handleInputChange = (e) => {
        setTaskValue(e.target.value)
        console.log(taskId, e.target.value, taskStatus)
        updateTask(taskId, e.target.value, taskStatus); // Call the parent's setInputValue
    };

    const handleStatusChange = () => {
        const newStatus = taskStatus === 'done' ? 'todo' : 'done';
        setTaskStatus(newStatus);
        updateTask(taskId, taskValue, newStatus); // Use the updated status directly
    }


    return (
        <>
            <Box
                className="flex align-items-center">
                <Button
                    className="m-3 flex-1"
                    variant="contained"
                    onClick={handleStatusChange}>
                    {taskStatus == 'done' ? 'Do again' : 'Finished'}
                </Button>
                <TextField
                    className="m-3 flex-8"
                    variant="standard"
                    value={taskValue}
                    onChange={handleInputChange}
                    style={{ margin: '10px 0' }}
                />
                <Button
                    className="m-3 p-0 flex-1"
                    variant="contained"
                    onClick={() => deleteTask(taskId)}>
                    <DeleteIcon
                        className='p-0'
                    />
                </Button>
            </Box>
        </>
    )
}