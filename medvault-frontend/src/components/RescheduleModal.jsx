// src/components/RescheduleModal.jsx

import React, { useState, useEffect } from 'react';
import { getDoctorAvailableSlots, requestReschedule } from '../services/api';

const RescheduleModal = ({ appointment, onClose, onRescheduleSuccess }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

useEffect(() => {
    const fetchSlots = async () => {
        // Now it checks for the simple doctorId property
        if (!appointment?.doctorId) {
            setError('Could not identify the doctor for this appointment.');
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            // Use the correct property to fetch slots
            const slotsData = await getDoctorAvailableSlots(appointment.doctorId);
            setAvailableSlots(slotsData);
        } catch (err) {
            setError('Could not load available time slots. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    fetchSlots();
}, [appointment]);

    const handleSubmit = async () => {
        if (!selectedSlotId) {
            setError('Please select a new time slot to continue.');
            return;
        }
        setError('');
        setMessage('');

        try {
            const successMsg = await requestReschedule(appointment.id, selectedSlotId);
            setMessage(successMsg);
            // After a delay, call the success callback from the parent and close
            setTimeout(() => {
                onRescheduleSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Reschedule Appointment</h2>
                <p>Please select a new available time slot for your appointment with <strong>Dr. {appointment.doctorFirstName} {appointment.doctorLastName}</strong>.</p>
                <hr />

                {loading ? (
                    <p>Loading available slots...</p>
                ) : error ? (
                    <p className="message error">{error}</p>
                ) : (
                    <div className="slots-container">
                        {availableSlots.length > 0 ? availableSlots.map(slot => (
                            <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`btn slot-btn ${selectedSlotId === slot.id ? 'active' : ''}`}
                            >
                                {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </button>
                        )) : <p>No other time slots are currently available for this doctor.</p>}
                    </div>
                )}
                
                {/* Show the main error for the submit action */}
                {error && !loading && <p className="message error" style={{marginTop: '1rem'}}>{error}</p>}
                {message && <p className="message success" style={{marginTop: '1rem'}}>{message}</p>}

                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-logout">Cancel</button>
                    <button onClick={handleSubmit} className="btn" disabled={!selectedSlotId || message}>
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;