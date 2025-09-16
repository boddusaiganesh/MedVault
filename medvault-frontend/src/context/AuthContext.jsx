// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // --- UPDATE: Separate state for token ---
  // Initialize state directly from localStorage. This is a safe synchronous operation.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Still start in a loading state

  // --- UPDATE: This effect now reacts to changes in the 'token' state ---
  useEffect(() => {
    // This effect runs whenever the token changes (on login/logout) or on initial page load.
    try {
      if (token) {
        // If a token exists, get the role and set the full user object.
        const role = localStorage.getItem('role');
        setUser({ token, role });
      } else {
        // If token is null, ensure user is also null.
        setUser(null);
      }
    } catch (error) {
      console.error("AuthContext error:", error);
      setUser(null); // Ensure user is null on error
    } finally {
      // We are finished trying to determine the auth state.
      setLoading(false);
    }
  }, [token]); // The dependency array ensures this runs when the token state changes.

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    // This is the only place we need to update the token state.
    // The useEffect above will handle updating the 'user' object.
    setToken(userData.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Setting the token to null will also trigger the useEffect to clear the user object.
    setToken(null);
  };

  // --- UPDATE: Provide the raw token in the context for API calls if needed ---
  // Although the best practice is for the API service to read from localStorage directly.
  const value = { user, token, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* 
        --- UPDATE: Critical fix for race conditions ---
        Only render the rest of the application AFTER the initial loading check is complete.
        This prevents child components from rendering with an incorrect auth state.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --- PRESERVED: The custom hook is unchanged ---
export const useAuth = () => {
  return useContext(AuthContext);
};