// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const credentials = { email, password };
      const responseData = await loginUser(credentials);

      localStorage.setItem('token', responseData.token);
      localStorage.setItem('role', responseData.role);

      if (responseData.firstLogin) {
        navigate('/set-new-password');
      } else if (responseData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (responseData.role === 'ROLE_DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (responseData.role === 'ROLE_USER') {
        navigate('/user/dashboard');
      } else {
        // Fallback for any other case
        navigate('/login');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <h1>MedVault</h1>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p className="message error">{error}</p>}
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
};
export default LoginPage;