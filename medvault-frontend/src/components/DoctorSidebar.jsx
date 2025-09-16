// src/components/DoctorSidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // It's good practice to use navigate for logout
import { useAuth } from '../context/AuthContext';
// --- UPDATE: Import the icons from the react-icons/lu library ---
import { LuLayoutDashboard, LuUser, LuCalendarPlus, LuCalendarCheck,LuMessageSquare  } from 'react-icons/lu';

const DoctorSidebar = () => {
  // --- PRESERVED: Logic to get logout function is correct ---
  const { logout } = useAuth();
  const navigate = useNavigate(); // Use navigate for consistent routing

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="sidebar">
      <h3>Doctor Portal</h3>
      {/* --- UPDATE: The <nav> block now includes icons --- */}
      <nav className="sidebar-nav">
        {/* Each NavLink now contains an icon component */}
        <NavLink to="/doctor/dashboard" end><LuLayoutDashboard /> Dashboard</NavLink>
        <NavLink to="/doctor/profile"><LuUser /> My Profile</NavLink>
        <NavLink to="/doctor/slots"><LuCalendarPlus /> Manage Slots</NavLink>
        {/* You correctly identified "My Schedule" is a better name */}
         <NavLink to="/doctor/schedule"><LuCalendarCheck /> My Schedule</NavLink>
         <NavLink to="/doctor/reviews"><LuMessageSquare /> Patient Feedback</NavLink>
      </nav>
      <div className="sidebar-footer">
        {/* UPDATE: Using a consistent handleLogout function */}
        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
      </div>
    </div>
  );
};

export default DoctorSidebar;   