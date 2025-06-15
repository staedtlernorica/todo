import { Box } from '@mui/material';
import TaskBoard from './TaskBoard';
import { useTodos } from '../hooks/useTodos';

export default function MainBoard() {
    const { todos, addTodo, deleteTodo, toggleComplete, editTodo, setTodos } = useTodos();

    const activeTodos = todos.filter((t) => !t.completed);
    const completedTodos = todos.filter((t) => t.completed);

    // Helper to reorder a list
    const reorderTodos = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    // Robust reorder handler: reorders in the main todos array, not just filtered lists
    const handleReorder = (type: 'active' | 'completed') => (startIndex, endIndex) => {
        // Find indices of the filtered group in the main todos array
        const indices = todos
            .map((t, i) => ({ ...t, i }))
            .filter((t) => (type === 'active' ? !t.completed : t.completed))
            .map((t) => t.i);

        const from = indices[startIndex];
        const to = indices[endIndex];

        const newTodos = Array.from(todos);
        const [removed] = newTodos.splice(from, 1);
        newTodos.splice(to, 0, removed);

        setTodos(newTodos);
    };

    return (
        <Box className="main-board flex">
            <TaskBoard
                boardType={'active'}
                boardName={'Do'}
                todos={activeTodos}
                onAdd={(text) => addTodo(text, false)} // Not completed
                onDelete={deleteTodo}
                onEdit={editTodo}
                onToggle={toggleComplete}
                onReorder={handleReorder('active')}
            />
            <TaskBoard
                boardType={'completed'}
                boardName={'Done'}
                todos={completedTodos}
                onAdd={(text) => addTodo(text, true)} // Completed!
                onDelete={deleteTodo}
                onEdit={editTodo}
                onToggle={toggleComplete}
                onReorder={handleReorder('completed')}
            />
        </Box>
    );
}