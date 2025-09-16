// src/pages/UserDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatientDashboardStats } from '../services/api';
import { LuUser, LuStethoscope, LuCalendarDays } from 'react-icons/lu';

const UserDashboardPage = () => {
    // --- PRESERVED: State and data fetching logic is correct ---
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getPatientDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch patient dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <h2>Loading Dashboard...</h2>;
    }

    return (
        <div>
            <h2>Patient Dashboard</h2>
            
            {/* --- THE FIX IS HERE --- */}
            {/* The property is now 'profileComplete' to match the backend DTO */}
            {!stats?.profileComplete && (
                <div className="message error" style={{ textAlign: 'center' }}>
                    <strong>Action Required:</strong> Your profile is incomplete.
                    <br />
                    <Link to="/user/profile" style={{ fontWeight: 'bold', color: 'var(--error-color)' }}>
                        Please complete your profile here
                    </Link> to book appointments.
                </div>
            )}

            <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                Welcome! Use the options below to manage your health journey.
            </p>
            
            {/* --- PRESERVED: The widget structure is correct --- */}
            <div className="dashboard-widgets">
                <Link to="/user/profile" className="widget-card">
                    <div className="widget-icon patients">
                        <LuUser />
                    </div>
                    <div className="widget-info">
                        <div className="value" style={{fontSize: '1.5rem'}}>My Profile</div>
                        <div className="label">Update your personal details</div>
                    </div>
                </Link>

                <Link to="/user/find-doctor" className="widget-card">
                    <div className="widget-icon doctors">
                        <LuStethoscope />
                    </div>
                    <div className="widget-info">
                        <div className="value" style={{fontSize: '1.5rem'}}>Find a Doctor</div>
                        <div className="label">Book a new appointment</div>
                    </div>
                </Link>

                <Link to="/user/my-appointments" className="widget-card">
                    <div className="widget-icon verify">
                        <LuCalendarDays />
                    </div>
                    <div className="widget-info">
                        <div className="value">{stats?.upcomingAppointments ?? 0}</div>
                        <div className="label">Upcoming Appointments</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default UserDashboardPage;

