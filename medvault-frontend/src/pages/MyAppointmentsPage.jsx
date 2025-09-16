// src/pages/MyAppointmentsPage.jsx

import React, { useState, useEffect } from 'react';
import { getMyPatientAppointments, cancelAppointment } from '../services/api';
import FeedbackModal from '../components/FeedbackModal';
import RescheduleModal from '../components/RescheduleModal';

const MyAppointmentsPage = () => {
    // --- PRESERVED: All state management is correct ---
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
   const [activeModal, setActiveModal] = useState({ type: null, data: null });
    // --- PRESERVED: All helper functions are correct ---
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await getMyPatientAppointments();
            setAppointments(data);
        } catch (err) {
            setError(err.message || 'Could not fetch appointments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await cancelAppointment(appointmentId);
                setMessage("Appointment cancelled successfully.");
                fetchAppointments(); // Refresh the list
            } catch(err) {
                setError(err.message || 'Failed to cancel appointment.');
            }
        }
    };
    


    const getStatusChipClass = (status) => {
        switch (status) {
            case 'APPROVED': return 'status-chip approved';
            case 'PENDING': return 'status-chip pending';
            case 'REJECTED': return 'status-chip rejected';
            case 'COMPLETED': return 'status-chip completed';
            case 'CANCELLED': return 'status-chip rejected'; // Use rejected style for cancelled
            default: return 'status-chip';
        }
    };

    
        // This function is now generic for closing any modal
    const handleCloseModal = () => {
        setActiveModal({ type: null, data: null });
    };
    
    const handleFeedbackSubmitted = () => {
        fetchAppointments();
        setMessage("Thank you for your feedback!");
    };
    
    const handleRescheduleSuccess = () => {
        setMessage("Your reschedule request was submitted successfully.");
        fetchAppointments();
    };

    if (loading) return <h2>Loading Your Appointments...</h2>;

    // --- The main update is in the JSX returned below ---
     return (
        <div>
            <h2>My Appointments</h2>
            <p>Here is a list of your past and upcoming appointments.</p>
            <hr />
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
            
            <div className="appointments-list">
                {appointments.length > 0 ? (
                    appointments.map(app => (
                        <div key={app.id} className="appointment-card">
                            <div className="appointment-details">
                                <h4>Dr. {app.doctorFirstName} {app.doctorLastName}</h4>
                                <p>{app.doctorSpecialization}</p>
                                <p><strong>Date:</strong> {new Date(app.appointmentDateTime).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(app.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>

                            <div className="appointment-status-action" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <div className={getStatusChipClass(app.status)}>
                                    {app.status.replace('_', ' ')}
                                </div>
                                
                                {app.status === 'APPROVED' && (
                                    // Use the new generic handler to open the 'reschedule' modal
                                    <button onClick={() => setActiveModal({ type: 'reschedule', data: app })} className="btn">
                                        Reschedule
                                    </button>
                                )}
                                
                                {(app.status === 'PENDING' || app.status === 'APPROVED') && (
                                    <button onClick={() => handleCancel(app.id)} className="btn btn-logout">
                                        Cancel
                                    </button>
                                )}
                                
                                {app.status === 'COMPLETED' && !app.hasFeedbackBeenSubmitted && (
                                    // Use the new generic handler to open the 'feedback' modal
                                    <button className="btn" onClick={() => setActiveModal({ type: 'feedback', data: app })}>
                                        Leave Feedback
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no appointments scheduled.</p>
                )}
            </div>

            {/* --- REFACTORED: Conditional rendering is now cleaner --- */}
            {activeModal.type === 'feedback' && (
                <FeedbackModal 
                    appointment={activeModal.data}
                    onClose={handleCloseModal}
                    onFeedbackSubmitted={handleFeedbackSubmitted}
                />
            )}

            {activeModal.type === 'reschedule' && (
                <RescheduleModal 
                    appointment={activeModal.data}
                    onClose={handleCloseModal}
                    onRescheduleSuccess={handleRescheduleSuccess}
                />
            )}
        </div>
    );
};

export default MyAppointmentsPage;