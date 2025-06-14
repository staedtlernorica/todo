import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useTodos() {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text: string, completed = false) => {
        if (!text.trim()) return;
        const newTodo = { id: uuidv4(), text: text.trim(), completed };
        setTodos([...todos, newTodo]);
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const toggleComplete = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const editTodo = (id: string, newText: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, text: newText } : todo
            )
        );
    };

    return {
        todos,
        addTodo,
        deleteTodo,
        toggleComplete,
        editTodo,
    };
}