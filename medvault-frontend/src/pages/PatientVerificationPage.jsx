// src/pages/PatientVerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { getPendingPatientVerifications, approvePatientVerification } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PatientVerificationPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth(); // We need the user for the token, which api.js will get from localStorage

    // This function fetches the list of patients awaiting ID verification
    const fetchPendingPatients = async () => {
        // No need for a token check here, as our api service handles it
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const data = await getPendingPatientVerifications();
            setPatients(data);
        } catch (err) {
            console.error("Failed to fetch pending patients:", err);
            setError(err.message || 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to fetch the data when the component first mounts
    useEffect(() => {
        fetchPendingPatients();
    }, []); // The empty dependency array ensures this runs only once on load

    // This function handles the approval action for a specific patient
    const handleApprove = async (patientId) => {
        setMessage('');
        setError('');
        try {
            const successMsg = await approvePatientVerification(patientId);
            setMessage(successMsg);
            // To provide instant feedback, we refresh the list by filtering out
            // the patient who was just approved.
            setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
        } catch (err) {
            console.error("Approval failed:", err);
            setError(err.message || 'Approval failed. Please try again.');
        }
    };

    if (loading) {
        return <h2>Loading Pending Patient Verifications...</h2>;
    }

    return (
        <div>
            <h2>Patient ID Verification</h2>
            <p style={{color: 'var(--text-secondary)'}}>
                Review and approve the identity of new patients who have uploaded their government ID.
            </p>
            <hr />
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            {patients.length === 0 ? (
                <p>No patients are currently pending ID verification.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {patients.map(patient => (
                        <li key={patient.id} style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            marginBottom: '1rem',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <strong style={{fontSize: '1.1rem'}}>{patient.firstName} {patient.lastName}</strong><br />
                                <span style={{color: 'var(--text-secondary)'}}>{patient.userEmail}</span><br />
                                <small>Status: {patient.verificationStatus.replace('_', ' ')}</small><br />
                                {/* 
                                    In a real-world app, this would be a link to download/view the ID:
                                    <a href={`/api/documents/${patient.governmentIdPath}`} target="_blank">View ID</a>
                                */}
                            </div>
                            <button
                                onClick={() => handleApprove(patient.id)}
                                className="btn"
                            >
                                Approve ID
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PatientVerificationPage;