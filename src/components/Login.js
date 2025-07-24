import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validUsers = [
    { username: "Wasim@cool", password: "Wasim@2324", name: "Administrator" },
    { username: "Naseer@Nj", password: "Naseer@Nj", name: "Staff Member" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = validUsers.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>N Jewellers Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit"
          className="login-btn"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;