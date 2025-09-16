// src/pages/DoctorDashboardPage.jsx

import React from 'react';
import { Link, useOutletContext } from 'react-router-dom'; // 1. Import useOutletContext

const DoctorDashboardPage = () => {
  // 2. THE FIX: Get the shared state from the parent layout via the Outlet context
  const { isProfileComplete } = useOutletContext();

   console.log("4. [Dashboard Page] Rendering. Received isProfileComplete prop:", isProfileComplete);

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      
      {/* This logic is now reliable because the prop is guaranteed to be correct */}
      {!isProfileComplete && (
        <div className="message error" style={{ textAlign: 'center' }}>
          <strong>Action Required:</strong> Your profile is incomplete.
          <br />
          <Link to="/doctor/profile" style={{ fontWeight: 'bold', color: 'var(--error-color)' }}>
            Please complete your profile here
          </Link> to create appointment slots.
        </div>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
        Welcome, Doctor!
      </p>
      <p>
        Please use the navigation sidebar on the left to manage your profile, 
        create availability slots, and review patient appointment requests.
      </p>
    </div>
  );
};

export default DoctorDashboardPage;