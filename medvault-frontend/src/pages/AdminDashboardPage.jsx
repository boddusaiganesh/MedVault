// src/pages/AdminDashboardPage.jsx

import React from 'react';
import CreateUserForm from '../components/CreateUserForm';

const AdminDashboardPage = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="app-container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} className="btn btn-logout">
        Logout
      </button>
      <h3>Create New User</h3>
      <CreateUserForm />
    </div>
  );
};

export default AdminDashboardPage;