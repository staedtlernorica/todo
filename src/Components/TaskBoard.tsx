import { useState } from 'react';
import { Box, Button, List, ListItem, ListItemIcon, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function TaskBoard({ todos, boardType, boardName, onAdd, onDelete, onEdit, onToggle, onReorder }) {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (!input.trim()) return;
        onAdd(input);
        setInput('');
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;
        onReorder(result.source.index, result.destination.index);
    };

    return (
        <Box sx={{ margin: '20px 0' }}>
            <h2>{boardName}</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={boardType}>
                    {(provided) => (
                        <List
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {todos.map((todo, index) => (
                                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                    {(provided) => (
                                        <ListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            dense
                                        >
                                            <ListItemIcon />
                                            <Button
                                                variant='contained'
                                                onClick={() => onToggle(todo.id)}>
                                                {
                                                    boardType === 'active' ?
                                                        'Did' :
                                                        'Redo'
                                                }
                                            </Button>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                value={todo.text}
                                                onChange={(e) => onEdit(todo.id, e.target.value)}
                                                size="small"
                                            />
                                            <Button variant='contained' onClick={() => onDelete(todo.id)}>Delete</Button>
                                        </ListItem>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>

            {onAdd && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        placeholder="Add a new task"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        size="small"
                    />
                    <Button variant="contained" onClick={handleAdd}>Add</Button>
                </Box>
            )}
        </Box>
    );
}