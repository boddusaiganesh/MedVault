// src/pages/DoctorSchedulePage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// --- UPDATE: All necessary API functions are imported ---
import { 
    getDoctorAppointments, 
    approveAppointment, 
    rejectAppointment, 
    completeAppointment,
    approveReschedule,
    rejectReschedule
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorSchedulePage = () => {
    const location = useLocation();
    
    // --- PRESERVED: State management is correct ---
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState(location.state?.defaultTab || 'PENDING');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    // --- UPDATE: Data fetching is now more efficient ---
    const fetchAppointments = async () => {
        if (!user?.token) return;
        setLoading(true);
        setError('');
        try {
            // Pass the current filter to the backend to fetch only what's needed
            const data = await getDoctorAppointments(filter);
            setAppointments(data);
        } catch (err) {
            setError(err.message || "Failed to fetch appointments.");
        } finally {
            setLoading(false);
        }
    };

    // This hook is now perfect. It re-fetches whenever the user changes the tab (filter).
    useEffect(() => {
        fetchAppointments();
    }, [filter, user]);

    // --- UPDATE: The action handler is now complete ---
    const handleAction = async (action, appointmentId) => {
        setMessage('');
        setError('');
        try {
            let successMsg = '';
            if (action === 'approve') successMsg = await approveAppointment(appointmentId);
            if (action === 'reject') successMsg = await rejectAppointment(appointmentId);
            if (action === 'complete') successMsg = await completeAppointment(appointmentId);
            if (action === 'approveReschedule') successMsg = await approveReschedule(appointmentId);
            if (action === 'rejectReschedule') successMsg = await rejectReschedule(appointmentId);
            
            setMessage(successMsg);
            // It's most reliable to re-fetch the list from the server after any action.
            fetchAppointments();
        } catch (err) {
            setError(err.message || `Action failed. Please try again.`);
        }
    };

    return (
        <div>
            <h2>My Schedule & Requests</h2>
            {/* The tabs are preserved but we can add appointment counts here later if desired */}
            <div className="tabs">
                <button onClick={() => setFilter('PENDING')} className={filter === 'PENDING' ? 'active' : ''}>Pending Requests</button>
                <button onClick={() => setFilter('APPROVED')} className={filter === 'APPROVED' ? 'active' : ''}>Upcoming Appointments</button>
                <button onClick={() => setFilter('COMPLETED')} className={filter === 'COMPLETED' ? 'active' : ''}>Past Appointments</button>
            </div>
            <hr />
            
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            {loading ? <p>Loading appointments...</p> : (
                appointments.length === 0 ? (
                    <p>No appointments found in this category.</p>
                ) : (
                    <div className="appointments-list">
                        {appointments.map(app => (
                            <div key={app.id} className="appointment-card">
                                <div className="appointment-details">
                                    <h4>Appointment with {app.patientFirstName} {app.patientLastName}</h4>

                                    {/* --- UPDATE: Conditional rendering for reschedule requests --- */}
                                    {app.rescheduleStatus === 'PENDING_APPROVAL' ? (
                                        <div className="reschedule-info">
                                            <p><strong>Original Time:</strong> <span style={{textDecoration: 'line-through'}}>{new Date(app.appointmentDateTime).toLocaleString()}</span></p>
                                            <p><strong>New Requested Time:</strong> {new Date(app.newlyRequestedTime).toLocaleString()}</p>
                                            <div className="status-chip warning" style={{marginTop: '0.5rem'}}>Reschedule Requested</div>
                                        </div>
                                    ) : (
                                        <p><strong>Time:</strong> {new Date(app.appointmentDateTime).toLocaleString()}</p>
                                    )}

                                    {app.notes && <p><strong>Patient Notes:</strong> "{app.notes}"</p>}
                                </div>
                                
                                <div className="appointment-actions">
                                    {/* --- UPDATE: Conditional rendering for all action buttons --- */}
                                    {app.rescheduleStatus === 'PENDING_APPROVAL' ? (
                                        <>
                                            <button onClick={() => handleAction('approveReschedule', app.id)} className="btn">Approve Change</button>
                                            <button onClick={() => handleAction('rejectReschedule', app.id)} className="btn btn-cancel">Reject Change</button>
                                        </>
                                    ) : app.status === 'PENDING' ? (
                                        <>
                                            <button onClick={() => handleAction('approve', app.id)} className="btn">Approve</button>
                                            <button onClick={() => handleAction('reject', app.id)} className="btn btn-cancel">Reject</button>
                                        </>
                                    ) : app.status === 'APPROVED' ? (
                                        <button onClick={() => handleAction('complete', app.id)} className="btn">Mark as Complete</button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default DoctorSchedulePage;