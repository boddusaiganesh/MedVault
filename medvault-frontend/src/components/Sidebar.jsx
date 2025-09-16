// src/components/Sidebar.jsx

// --- PRESERVED: All imports are correct ---
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuLayoutDashboard, LuUsers, LuStethoscope, LuUserCheck, LuUserPlus, LuClipboardList,LuStar  } from 'react-icons/lu';

const Sidebar = () => {
  // --- PRESERVED: All component logic is correct ---
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>MedVault Admin</h3>
      </div>
      
      {/* --- UPDATE: The <nav> block has one new link --- */}
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" end>
          <LuLayoutDashboard /> 
          Dashboard Home
        </NavLink>
        <NavLink to="/admin/patient-requests">
          <LuUsers /> 
          Patient Requests
        </NavLink>

        {/* --- THIS IS THE NEWLY ADDED LINK --- */}
        <NavLink to="/admin/patient-verification">
          <LuUserCheck /> 
          Patient ID Verification
        </NavLink>

        <NavLink to="/admin/doctor-requests">
          <LuStethoscope /> 
          Doctor Requests
        </NavLink>
        <NavLink to="/admin/doctor-verification">
          <LuUserCheck /> 
          Doctor Verification
        </NavLink>
                {/* --- NEW LINKS --- */}
        <NavLink to="/admin/manage-reviews"><LuStar /> Manage Reviews</NavLink>
        <NavLink to="/admin/manage-patients"><LuClipboardList /> Manage Patients</NavLink>
        <NavLink to="/admin/manage-doctors"><LuClipboardList /> Manage Doctors</NavLink>

        <NavLink to="/admin/create-user">
          <LuUserPlus /> 
          Create User Directly
        </NavLink>
      </nav>
      
      {/* --- PRESERVED: The footer and logout button are correct --- */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;