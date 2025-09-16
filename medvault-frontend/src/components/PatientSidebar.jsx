// src/components/PatientSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// --- PRESERVED: Imports are correct ---
import { LuLayoutDashboard, LuUser, LuStethoscope, LuCalendarDays } from 'react-icons/lu';

const PatientSidebar = () => {
    // --- PRESERVED: Component logic is correct ---
    const { logout } = useAuth();

    return (
        <div className="sidebar">
            <h3>Patient Portal</h3>
            {/* --- UPDATE: The <nav> block is now corrected with icons --- */}
            <nav className="sidebar-nav">
                <NavLink to="/user/dashboard" end>
                    <LuLayoutDashboard /> Dashboard
                </NavLink>
                <NavLink to="/user/profile">
                    <LuUser /> My Profile
                </NavLink>
                <NavLink to="/user/find-doctor">
                    <LuStethoscope /> Find a Doctor
                </NavLink>
                <NavLink to="/user/my-appointments">
                    <LuCalendarDays /> My Appointments
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={logout} className="btn btn-logout">Logout</button>
            </div>
        </div>
    );
};

export default PatientSidebar;