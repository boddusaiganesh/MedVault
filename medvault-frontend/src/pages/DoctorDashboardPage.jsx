// src/pages/DoctorDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { getMyDoctorProfile } from '../services/api';

const DoctorDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found.");
        
        const profileData = await getMyDoctorProfile(token);
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Could not fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="app-container"><h2>Loading Doctor Profile...</h2></div>;
  }

  if (error) {
    return <div className="app-container"><h2>Error</h2><p className="message error">{error}</p></div>;
  }

  return (
    <div className="app-container">
      <h2>Welcome, Dr. {profile.firstName}!</h2>
      <button onClick={handleLogout} className="btn btn-logout">
        Logout
      </button>
      
      <div style={{ textAlign: 'left', marginTop: '2rem' }}>
        <h3>Your Professional Details</h3>
        <p><strong>Name:</strong> Dr. {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Specialization:</strong> {profile.specialization || 'Not set'}</p>
        <p><strong>Qualification:</strong> {profile.qualification || 'Not set'}</p>
        <p><strong>Experience:</strong> {profile.experienceYears ? `${profile.experienceYears} years` : 'Not set'}</p>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;