// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TodoList from './pages/getPage';
import CreateTodo from './pages/postPage';
import UpdateTodo from './pages/putPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Todo Manager</h1>
                    <nav>
                        <ul className="nav-links">
                            <li>
                                <Link to="/">View Todos</Link>
                            </li>
                            <li>
                                <Link to="/create">Create Todo</Link>
                            </li>
                        </ul>
                    </nav>
                </header>

                <main className="App-content">
                    <Routes>
                        <Route path="/" element={<TodoList />} />
                        <Route path="/create" element={<CreateTodo />} />
                        <Route path="/update/:id" element={<UpdateTodo />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;