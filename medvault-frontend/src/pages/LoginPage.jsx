// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const credentials = { email, password };
      const responseData = await loginUser(credentials);

      login({ token: responseData.token, role: responseData.role });

      // --- THE FIX IS IN THIS BLOCK ---
      if (responseData.firstLogin) {
      navigate('/set-new-password');
    } else if (responseData.role === 'ROLE_ADMIN') {
      navigate('/admin/dashboard'); // Use the full, explicit path
    } else if (responseData.role === 'ROLE_DOCTOR') {
      navigate('/doctor/dashboard'); // Use the full, explicit path
    } else if (responseData.role === 'ROLE_USER') {
      navigate('/user/dashboard'); // Use the full, explicit path
    } else {
      // Fallback case
      navigate('/login');
    }

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  // The JSX for the form is correct.
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
      <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <Link to="/register" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account? Request one here.
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;