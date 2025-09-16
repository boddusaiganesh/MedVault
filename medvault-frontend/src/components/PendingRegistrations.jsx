// src/components/PendingRegistrations.jsx

import React, { useState, useEffect } from 'react';
import { getPendingRegistrations, approveRegistration } from '../services/api';

const PendingRegistrations = ({ role }) => {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            
            const data = await getPendingRegistrations(role);
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [role]);

    const handleApprove = async (requestId) => {
        try {
            
            const successMessage = await approveRegistration(requestId);
            setMessage(successMessage);
            // Refresh the list after approval by filtering out the approved request
            setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p>Loading requests...</p>;
    }

    return (
        <div>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            {requests.length === 0 ? (
                <p>No pending {role.replace('ROLE_', '').toLowerCase()} registration requests.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {requests.map(req => (
                        <li key={req.id} style={{ 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            marginBottom: '1rem', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            textAlign: 'left'
                        }}>
                            <div>
                                <strong>{req.name}</strong> ({req.email})<br />
                                <small style={{color: 'var(--text-secondary)'}}>
                                    Requested Role: {req.requestedRole.replace('ROLE_', '')}
                                </small>
                            </div>
                            <button onClick={() => handleApprove(req.id)} className="btn">
                                Approve & Create
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingRegistrations;