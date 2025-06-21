import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TodoApp from './components/TodoApp';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {!token ? (
        showRegister ? (
          <Register setToken={setToken} />
        ) : (
          <Login setToken={setToken} />
        )
      ) : (
        <TodoApp token={token} setToken={setToken} />
      )}
      {!token && (
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Go to Login' : 'Go to Register'}
        </button>
      )}
    </div>
  );
};

export default App;