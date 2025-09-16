// src/components/AdminLayout.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

// --- PRESERVED: All existing page imports are kept ---
import AdminDashboardPage from '../pages/AdminDashboardPage';
import PatientRequestsPage from '../pages/PatientRequestsPage';
import DoctorRequestsPage from '../pages/DoctorRequestsPage';
import CreateUserPage from '../pages/CreateUserPage';
import DoctorVerificationPage from '../pages/DoctorVerificationPage';

// --- UPDATE: Import the new page for patient verification ---
import PatientVerificationPage from '../pages/PatientVerificationPage';
import ManagePatientsPage from '../pages/ManagePatientsPage'; // NEW
import ManageDoctorsPage from '../pages/ManageDoctorsPage';   // NEW
import ManageReviewsPage from '../pages/ManageReviewsPage'; // Import the new page

const AdminLayout = () => {
  // --- PRESERVED: The main layout structure is unchanged ---
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        {/* This layout's internal router */}
        <Routes>
          {/* --- PRESERVED: All existing routes are unchanged --- */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="patient-requests" element={<PatientRequestsPage />} />
          <Route path="doctor-requests" element={<DoctorRequestsPage />} />
          <Route path="doctor-verification" element={<DoctorVerificationPage />} />
          
          {/* --- UPDATE: Add the new route for patient verification --- */}
          <Route path="patient-verification" element={<PatientVerificationPage />} />
                    {/* --- NEW ROUTES --- */}
          <Route path="manage-reviews" element={<ManageReviewsPage />} />
          <Route path="manage-patients" element={<ManagePatientsPage />} />
          <Route path="manage-doctors" element={<ManageDoctorsPage />} />
          
          <Route path="create-user" element={<CreateUserPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;