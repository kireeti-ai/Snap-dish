// src/components/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

// The 'onLoginSuccess' prop is a function passed from App.jsx 
// to update the state once the admin is successfully logged in.
function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('https://snap-dish.onrender.com/api/users/login', {
        email,
        password,
      });

      // Check if the login was successful AND the user is an admin
      if (response.data.success && response.data.role === 'admin') {
        // Store the token in localStorage to keep the user logged in
        localStorage.setItem('token', response.data.token);
        onLoginSuccess(); // Tell the App component that login was successful
      } else {
        setError('Login failed. Please check your credentials or role.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;