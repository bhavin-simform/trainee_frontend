// src/pages/TodoList.js - GET page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/todos`);
                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }
                const data = await response.json();
                setTodos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, [API_URL]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                const response = await fetch(`${API_URL}/todos/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete todo');
                }

                // Remove the deleted todo from state
                setTodos(todos.filter(todo => todo.id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            const response = await fetch(`${API_URL}/todos/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: todo.task,
                    done: !todo.done,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            // Update the todo in state
            setTodos(todos.map(t =>
                t.id === todo.id ? { ...t, done: !t.done } : t
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading todos...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="todo-list">
            <h2>My Todos</h2>
            {todos.length === 0 ? (
                <p>No todos yet. Add one!</p>
            ) : (
                <ul>
                    {todos.map(todo => (
                        <li key={todo.id} className={todo.done ? 'completed' : ''}>
                            <div className="todo-content">
                                <input
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => handleToggleComplete(todo)}
                                />
                                <span className="todo-task">{todo.task}</span>
                            </div>
                            <div className="todo-actions">
                                <Link to={`/update/${todo.id}`} className="edit-btn">Edit</Link>
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/create" className="add-btn">Add New Todo</Link>
        </div>
    );
}

export default TodoList;