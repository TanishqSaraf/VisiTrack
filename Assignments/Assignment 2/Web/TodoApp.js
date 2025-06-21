import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = ({ token, setToken }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/todos', {
          headers: { 'x-auth-token': token },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  const addTask = async (text) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/todos',
        { text },
        { headers: { 'x-auth-token': token } }
      );
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      setTasks(tasks.map(task =>
        task._id === id ? { ...task, completed: res.data.completed } : task
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTask(input);
      setInput('');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      <h2>Todo App</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTasks.map(task => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task._id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;