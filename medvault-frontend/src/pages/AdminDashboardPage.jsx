// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboardStats } from '../services/api';
// --- UPDATE: Add the LuClipboardList icon ---
import { LuUsers, LuStethoscope, LuUserCheck, LuClipboardList } from 'react-icons/lu';

const AdminDashboardPage = () => {
    // --- PRESERVED: State and data fetching logic is correct ---
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getAdminDashboardStats();
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

    return (
        <div>
            <h2>Dashboard Home</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
                Welcome, Admin! Here is a summary of pending tasks and system totals.
            </p>
            
            {/* --- UPDATE: The dashboard-widgets div now contains the new widgets --- */}
            <div className="dashboard-widgets">
                {/* --- PRESERVED: Existing widgets are unchanged --- */}
                <Link to="/admin/patient-requests" className="widget-card">
                    <div className="widget-icon patients">
                        <LuUsers />
                    </div>
                    <div className="widget-info">
                        <div className="value">{stats?.pendingPatientRequests ?? 0}</div>
                        <div className="label">Patient Requests</div>
                    </div>
                </Link>

                <Link to="/admin/doctor-requests" className="widget-card">
                    <div className="widget-icon doctors">
                        <LuStethoscope />
                    </div>
                    <div className="widget-info">
                        <div className="value">{stats?.pendingDoctorRequests ?? 0}</div>
                        <div className="label">Doctor Requests</div>
                    </div>
                </Link>

                <Link to="/admin/doctor-verification" className="widget-card">
                    <div className="widget-icon verify">
                        <LuUserCheck />
                    </div>
                    <div className="widget-info">
                        <div className="value">{stats?.pendingDoctorVerifications ?? 0}</div>
                        <div className="label">Pending Verifications</div>
                    </div>
                </Link>

                {/* --- NEW WIDGETS --- */}
                <Link to="/admin/manage-patients" className="widget-card">
                    <div className="widget-icon patients">
                        <LuClipboardList />
                    </div>
                    <div className="widget-info">
                        {/* The 'totalPatients' field comes from our updated backend DTO */}
                        <div className="value">{stats?.totalPatients ?? 0}</div>
                        <div className="label">Total Patients</div>
                    </div>
                </Link>
                    
                <Link to="/admin/manage-doctors" className="widget-card">
                    <div className="widget-icon doctors">
                        <LuClipboardList />
                    </div>
                    <div className="widget-info">
                        {/* The 'totalDoctors' field comes from our updated backend DTO */}
                        <div className="value">{stats?.totalDoctors ?? 0}</div>
                        <div className="label">Total Doctors</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;