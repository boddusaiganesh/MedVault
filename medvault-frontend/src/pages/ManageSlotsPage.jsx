// src/pages/ManageSlotsPage.jsx
// This is a basic structure. A real app would use a calendar library.
import React, { useState } from 'react';
import { createDoctorSlots } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageSlotsPage = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState(30);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!startTime || !endTime || new Date(endTime) <= new Date(startTime)) {
            setError('Please select a valid start and end time.');
            return;
        }
        try {
            const slotData = {
                startTime: startTime,
                endTime: endTime,
                slotDurationMinutes: duration,
            };
            const successMsg = await createDoctorSlots(slotData);
            setMessage(successMsg);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Manage Availability Slots</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Start Date and Time</label>
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                </div>
                 <div className="form-group">
                    <label>End Date and Time</label>
                    <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                </div>
                 <div className="form-group">
                    <label>Slot Duration (minutes)</label>
                    <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} required />
                </div>
                {message && <p className="message success">{message}</p>}
                {error && <p className="message error">{error}</p>}
                <button type="submit" className="btn">Create Slots</button>
            </form>
        </div>
    );
};
export default ManageSlotsPage;