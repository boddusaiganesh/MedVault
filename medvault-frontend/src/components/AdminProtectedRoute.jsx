// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the custom hook

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If we are still loading the user state, show a loading message
  if (loading) {
    return <div className="app-container"><h2>Loading...</h2></div>;
  }

  // If loading is finished and there's no user OR the role is wrong
  if (!user || user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/login" replace />;
  }

  // If loading is finished and the user is an admin
  return children;
};

export default AdminProtectedRoute;