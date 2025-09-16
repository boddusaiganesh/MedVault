// src/pages/RegistrationPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitRegistration } from '../services/api';

const RegistrationPage = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [requestedRole, setRequestedRole] = useState('ROLE_USER');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);
        try {
            const registrationData = { name, age: parseInt(age), email, phoneNumber, requestedRole };
            const successMessage = await submitRegistration(registrationData);
            setMessage(successMessage);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <h1>MedVault</h1>
            <h2>Request an Account</h2>
            
            {!message ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>I am a...</label>
                        <select value={requestedRole} onChange={e => setRequestedRole(e.target.value)}>
                            <option value="ROLE_USER">Patient</option>
                            <option value="ROLE_DOCTOR">Doctor</option>
                        </select>
                    </div>
                    {error && <p className="message error">{error}</p>}
                    <button type="submit" className="btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            ) : (
                <div>
                    <p className="message success">{message}</p>
                </div>
            )}

            <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default RegistrationPage;