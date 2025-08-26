// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SetNewPasswordPage from './pages/SetNewPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage'; // Import Doctor dashboard
import UserDashboardPage from './pages/UserDashboardPage';   // Import User dashboard
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';       // Import the generic protector

function App() {
  return (
    <div>
      {/* We can remove the main H1 title if we want each page to have its own */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-new-password" element={<SetNewPasswordPage />} />
        
        {/* --- Protected Routes --- */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute>
              <DoctorDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;