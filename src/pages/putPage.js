import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

function UpdateTodo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState('');
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Fetch the todo details when the component mounts
    useEffect(() => {
        const fetchTodo = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/todos/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch todo');
                }
                const todo = await response.json();
                setTask(todo.task);
                setDone(todo.done);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [id, API_URL]);

    // Handle the form submit for updating a todo
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!task.trim()) {
            setError('Task cannot be empty');
            return;
        }

        try {
            setSaving(true);
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task,
                    done: done,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update todo');
            }

            // Check the updated todo in the response
            const updatedTodo = await response.json();
            console.log('Updated Todo:', updatedTodo); // Log the updated todo for debugging

            // Redirect to the list page after successful update
            navigate('/');
        } catch (err) {
            setError(err.message); // Show error if the update fails
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading todo...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="update-todo">
            <h2>Update Todo</h2>

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

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={done}
                            onChange={(e) => setDone(e.target.checked)}
                        />
                        Mark as completed
                    </label>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Update Todo'}
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

export default UpdateTodo;
