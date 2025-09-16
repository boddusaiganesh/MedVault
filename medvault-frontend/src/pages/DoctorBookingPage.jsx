// src/pages/DoctorBookingPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
// --- UPDATE: We will create this new API function next ---
import { getPublicDoctorProfile, getDoctorAvailableSlots, bookAppointment } from '../services/api';

const DoctorBookingPage = () => {
    // --- PRESERVED: These are still needed ---
    const { doctorId } = useParams();
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- UPDATE: Add state for doctor profile, loading, and notes ---
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState(''); // State for the booking notes
    const [selectedSlot, setSelectedSlot] = useState(null);

    // --- UPDATE: Implement the data fetching logic ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch both the doctor's profile and their available slots
                const doctorData = await getPublicDoctorProfile(doctorId);
                const slotsData = await getDoctorAvailableSlots(doctorId);
                setDoctor(doctorData);
                setSlots(slotsData);
            } catch (err) {
                console.error(err);
                setError('Failed to load booking information. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [doctorId]); // Re-fetch if the doctorId changes

    // --- UPDATE: Implement the booking handler with notes ---
    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedSlot) {
            setError('Please select a time slot.');
            return;
        }
        setMessage('');
        setError('');
        try {
            const bookingData = { slotId: selectedSlot, notes };
            const successMsg = await bookAppointment(bookingData);
            setMessage(successMsg);
            setSelectedSlot(null); // Reset selection
            setNotes(''); // Clear notes
            
            // Refresh slots after booking to remove the one that was just booked
            const updatedSlots = await getDoctorAvailableSlots(doctorId);
            setSlots(updatedSlots);
        } catch (err) {
            setError(err.message);
        }
    };
    
    if (loading) {
        return <h2>Loading Doctor's Availability...</h2>;
    }

    if (error) {
        return <p className="message error">{error}</p>;
    }

    return (
        <div>
            {/* --- UPDATE: Display the doctor's profile --- */}
            {doctor && (
                <>
                    <h2>Book Appointment with Dr. {doctor.firstName} {doctor.lastName}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {doctor.specialization} - {doctor.experienceYears} years of experience
                    </p>
                </>
            )}
            <hr />

            {/* --- UPDATE: The form now wraps the slots and notes --- */}
            <form onSubmit={handleBooking}>
                <h3>Select an Available Time Slot</h3>
                {message && <p className="message success">{message}</p>}
                
                <div className="slots-container">
                    {slots.length > 0 ? slots.map(slot => (
                        <button 
                            key={slot.id}
                            type="button" // Important: prevents form submission on click
                            onClick={() => setSelectedSlot(slot.id)}
                            // Dynamically change style for the selected button
                            className={`btn slot-btn ${selectedSlot === slot.id ? 'active' : ''}`}
                        >
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </button>
                    )) : <p>No available slots for this doctor.</p>}
                </div>

                {/* --- UPDATE: Add notes/reason for visit section --- */}
                {selectedSlot && ( // Only show notes area after a slot is selected
                    <div className="form-group" style={{marginTop: '2rem'}}>
                        <label htmlFor="notes">Reason for Visit (Optional)</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="4"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                        
                        {error && <p className="message error" style={{marginTop: '1rem'}}>{error}</p>}

                        <button type="submit" className="btn" style={{marginTop: '1rem'}}>
                            Confirm Booking
                        </button>
                    </div>
                )}
            </form>

            <Link to="/user/find-doctor" style={{display: 'block', marginTop: '2rem'}}>
                &larr; Back to Doctor List
            </Link>
        </div>
    );
};

export default DoctorBookingPage;
