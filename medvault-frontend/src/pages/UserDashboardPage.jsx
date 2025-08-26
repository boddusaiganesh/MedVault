// src/pages/UserDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { getMyPatientProfile } from '../services/api';

const UserDashboardPage = () => {
  // State to hold the user's profile data
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found.");
        }
        // Fetch the logged-in user's specific profile
        const profileData = await getMyPatientProfile(token);
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Could not fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // The empty array [] means this effect runs only once

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  // --- Render content based on the state ---
  if (loading) {
    return <div className="app-container"><h2>Loading Profile...</h2></div>;
  }

  if (error) {
    return <div className="app-container"><h2>Error</h2><p className="message error">{error}</p></div>;
  }
  
  return (
    <div className="app-container">
      {/* The title is now personalized! */}
      <h2>Welcome, {profile.firstName}!</h2>
      <button onClick={handleLogout} className="btn btn-logout">
        Logout
      </button>
      
      <div style={{ textAlign: 'left', marginTop: '2rem' }}>
        <h3>Your Details</h3>
        <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Contact:</strong> {profile.contactNumber || 'Not set'}</p>
        <p><strong>Date of Birth:</strong> {profile.dateOfBirth || 'Not set'}</p>
      </div>
    </div>
  );
};

export default UserDashboardPage;