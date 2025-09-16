// src/components/DoctorLayout.jsx

import React from 'react';
// --- UPDATE: Import routing components ---
import { Routes, Route, Navigate } from 'react-router-dom'; 
import DoctorSidebar from './DoctorSidebar';

// --- UPDATE: Import all the pages this layout will manage ---
import DoctorDashboardPage from '../pages/DoctorDashboardPage';
import DoctorProfilePage from '../pages/DoctorProfilePage';
import ManageSlotsPage from '../pages/ManageSlotsPage';
import DoctorSchedulePage from '../pages/DoctorSchedulePage';
import MyReviewsPage from '../pages/MyReviewsPage'; // Import the new page

// --- UPDATE: The component is now much simpler ---
const DoctorLayout = () => {
  // All state and data fetching has been removed from the layout.
  // It now only provides the static structure.

  return (
    <div className="admin-layout"> {/* We can still reuse the admin-layout CSS class */}
      <DoctorSidebar />
      <main className="admin-content">
        {/* 
          --- UPDATE: The Outlet is replaced with this self-contained router ---
          This <Routes> block controls what is rendered in the main content area.
        */}
        <Routes>
          {/* If the user is at the base path ("/doctor"), redirect to the dashboard */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          
          {/* Define the specific pages for the doctor section */}
          <Route path="dashboard" element={<DoctorDashboardPage />} />
          <Route path="profile" element={<DoctorProfilePage />} />
          <Route path="slots" element={<ManageSlotsPage />} />
          <Route path="schedule" element={<DoctorSchedulePage />} />
          <Route path="reviews" element={<MyReviewsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default DoctorLayout;