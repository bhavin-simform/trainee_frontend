// src/pages/CreateTodo.js - POST page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CreateTodo() {
    const [task, setTask] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!task.trim()) {
            setError('Task cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task,
                    done: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            // Redirect to the list page after successful creation
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-todo">
            <h2>Create New Todo</h2>
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="task">Task:</label>
                    <input
                        type="text"
                        id="task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter your task"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Todo'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTodo;