// src/components/PatientLayout.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PatientSidebar from './PatientSidebar';

// --- UPDATE: Import all necessary pages for this layout ---
import UserDashboardPage from '../pages/UserDashboardPage';
import PatientProfilePage from '../pages/PatientProfilePage';
import FindDoctorPage from '../pages/FindDoctorPage';
import DoctorBookingPage from '../pages/DoctorBookingPage';
// We will also import the placeholder for the next page we build
import MyAppointmentsPage from '../pages/MyAppointmentsPage';

const PatientLayout = () => {
  // This component correctly has no internal logic. It only provides the layout.
  return (
    <div className="admin-layout"> {/* Reusing the .admin-layout CSS class */}
      <PatientSidebar />
      <main className="admin-content">
        {/* This router controls the content area for the /user/* path */}
        <Routes>
          {/* Default route for "/user" redirects to the dashboard */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          
          {/* --- All patient routes are now correctly defined --- */}
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="find-doctor" element={<FindDoctorPage />} />
          
          {/* This route includes a dynamic parameter ':doctorId' */}
          <Route path="book-appointment/:doctorId" element={<DoctorBookingPage />} />
          
          {/* Placeholder for the feature we will build next */}
          <Route path="my-appointments" element={<MyAppointmentsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default PatientLayout;