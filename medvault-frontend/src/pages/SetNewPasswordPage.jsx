// src/pages/SetNewPasswordPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNewPassword as apiSetNewPassword } from '../services/api'; // Renamed import

const SetNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState(''); // State setter
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Session token not found. Please log in again.");
      }
      
      const responseData = await apiSetNewPassword({ newPassword }, token); // Use renamed function

      setMessage(responseData.message);
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error("Set password failed:", err);
      setError(err.message || 'Failed to set new password. Please try again.');
    }
  };

 return (
    // THE FIX IS HERE: Apply the app-container class
    <div className="app-container"> 
      <h1>MedVault</h1> {/* Assuming you want the title on this page too */}
      <h2>Set Your New Password</h2>
      <form>
        <div className="form-group"> {/* Apply form-group class */}
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <div className="form-group"> {/* Apply form-group class */}
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p className="message error">{error}</p>} {/* Apply message and error classes */}
        {message && <p className="message success">{message}</p>} {/* Apply message and success classes */}
        <button type="button" onClick={handleSubmit} className="btn"> {/* Apply btn class */}
          Set Password
        </button>
      </form>
    </div>
  );
};
export default SetNewPasswordPage;