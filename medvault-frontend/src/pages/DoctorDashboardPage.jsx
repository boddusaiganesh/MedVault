// src/pages/DoctorDashboardPage.jsx

// --- PRESERVED: Imports are correct ---
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorDashboardStats } from '../services/api';
import { LuUser, LuCalendarCheck, LuCalendarClock } from 'react-icons/lu';

const DoctorDashboardPage = () => {
    // --- PRESERVED: State and data fetching logic is correct ---
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getDoctorDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <h2>Loading Dashboard...</h2>;
    }

    const verificationStatusText = stats?.verificationStatus.replace('_', ' ').toLowerCase();

    // --- PRESERVED: The main JSX structure is correct ---
    return (
        <div>
            <h2>Doctor Dashboard</h2>
            
            {/* Conditional banners are correct */}
            {!stats?.profileComplete && (
                <div className="message error">
                    <strong>Action Required:</strong> <Link to="/doctor/profile" style={{ fontWeight: 'bold', color: 'var(--error-color)' }}>
                        Please complete your profile
                    </Link> to enable all features.
                </div>
            )}

            {stats?.profileComplete && stats?.verificationStatus !== 'VERIFIED' && (
                <div className="message warning">
                    <strong>Verification Status:</strong> Your documents are currently {verificationStatusText}. 
                    You cannot create slots until your profile is verified by an admin.
                </div>
            )}

            <div className="dashboard-widgets">
                {/* My Profile widget is correct */}
                <Link to="/doctor/profile" className="widget-card">
                    <div className="widget-icon patients">
                        <LuUser />
                    </div>
                    <div className="widget-info">
                        <div className="value" style={{fontSize: '1.5rem', lineHeight: '1.2'}}>My Profile</div>
                        <div className="label">Update your professional details</div>
                    </div>
                </Link>

                {/* --- UPDATE: Add the 'state' prop to this Link --- */}
                <Link to="/doctor/schedule" state={{ defaultTab: 'PENDING' }} className="widget-card">
                    <div className="widget-icon verify">
                        <LuCalendarClock />
                    </div>
                    <div className="widget-info">
                        <div className="value">{stats?.pendingAppointmentRequests ?? 0}</div>
                        <div className="label">Pending Requests</div>
                    </div>
                </Link>

                {/* --- UPDATE: Add the 'state' prop to this Link --- */}
                <Link to="/doctor/schedule" state={{ defaultTab: 'APPROVED' }} className="widget-card">
                    <div className="widget-icon doctors">
                        <LuCalendarCheck />
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

export default DoctorDashboardPage;