// src/App.jsx

// --- UPDATE: All page component imports are now present ---
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SetNewPasswordPage from './pages/SetNewPasswordPage';
import RegistrationPage from './pages/RegistrationPage';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PatientRequestsPage from './pages/PatientRequestsPage';
import DoctorRequestsPage from './pages/DoctorRequestsPage';
import CreateUserPage from './pages/CreateUserPage';
import DoctorVerificationPage from './pages/DoctorVerificationPage';

// Doctor Imports
import DoctorLayout from './components/DoctorLayout';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ManageSlotsPage from './pages/ManageSlotsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage'; // Corrected name

// Patient (User) Imports
import PatientLayout from './components/PatientLayout';
import UserDashboardPage from './pages/UserDashboardPage';
import PatientProfilePage from './pages/PatientProfilePage';
import FindDoctorPage from './pages/FindDoctorPage';
import DoctorBookingPage from './pages/DoctorBookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';

// Protector Imports
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';

// --- PRESERVED: This App component structure is the final, correct version ---
function App() {
  const location = useLocation();
  const isFullLayoutRoute = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/doctor') || 
    location.pathname.startsWith('/user');
  const layoutClass = isFullLayoutRoute ? 'layout-full' : 'layout-centered';

  return (
    <div className={layoutClass}>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/set-new-password" element={<SetNewPasswordPage />} />
        
        {/* --- Wildcard routes pointing to Layout components --- */}
        <Route 
          path="/user/*"
          element={<ProtectedRoute><PatientLayout /></ProtectedRoute>}
        />
        <Route 
          path="/doctor/*"
          element={<ProtectedRoute><DoctorLayout /></ProtectedRoute>}
        />
        <Route 
          path="/admin/*" 
          element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}
        />
      </Routes>
    </div>
  );
}

export default App;