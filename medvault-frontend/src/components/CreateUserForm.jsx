// src/components/CreateUserForm.jsx

import React, { useState } from 'react';
import { createUser } from '../services/api';

const CreateUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ROLE_USER');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Admin token not found. Please log in again.');
      }

      const userData = { name, email, role };
      const successMessage = await createUser(userData, token);

      setMessage(successMessage);
      setName('');
      setEmail('');
      setRole('ROLE_USER');

    } catch (err) {
      console.error('Create user error:', err);
      setError(err.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ROLE_USER">User (Patient)</option>
          <option value="ROLE_DOCTOR">Doctor</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
      </div>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};


export default CreateUserForm;