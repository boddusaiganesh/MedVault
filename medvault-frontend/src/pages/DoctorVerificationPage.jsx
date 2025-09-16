// src/pages/DoctorVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { getPendingVerifications, approveDoctorVerification } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorVerificationPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Function to fetch the list of doctors
    const fetchPendingDoctors = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const data = await getPendingVerifications();
            setDoctors(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch the data when the component first loads
    useEffect(() => {
        fetchPendingDoctors();
    }, [user]);

    // Function to handle the approval
    const handleApprove = async (doctorId) => {
        setMessage('');
        setError('');
        try {
            const successMsg = await approveDoctorVerification(doctorId);
            setMessage(successMsg);
            // Refresh the list by filtering out the doctor who was just approved
            setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== doctorId));
        } catch (err) {
            setError(err.message || 'Approval failed.');
        }
    };

    if (loading) {
        return <h2>Loading Pending Verifications...</h2>;
    }

    return (
        <div>
            <h2>Doctor Verification Requests</h2>
            <p>Review the details of doctors who have submitted their documents for verification.</p>
            <hr />
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            {doctors.length === 0 ? (
                <p>No doctors are currently pending verification.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {doctors.map(doctor => (
                        <li key={doctor.id} style={{
                            border: '1px solid var(--border-color)', borderRadius: '8px',
                            padding: '1rem', marginBottom: '1rem', textAlign: 'left'
                        }}>
                            <strong>Name:</strong> {doctor.firstName} {doctor.lastName}<br />
                            <strong>Specialization:</strong> {doctor.specialization}<br />
                            <strong>Qualification:</strong> {doctor.qualification}<br />
                            <strong>Status:</strong> {doctor.verificationStatus.replace('_', ' ')}<br />
                            {/* In a real app, you would have links to view the uploaded documents here */}
                            <button
                                onClick={() => handleApprove(doctor.id)}
                                className="btn"
                                style={{ marginTop: '1rem' }}
                            >
                                Approve Verification
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DoctorVerificationPage;