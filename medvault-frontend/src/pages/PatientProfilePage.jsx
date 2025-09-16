// src/pages/PatientProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- UPDATE: Import the new API function ---
import { getMyPatientProfile, updateMyPatientProfile, uploadPatientGovernmentId } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PatientProfilePage = () => {
    // --- PRESERVED: State for the main profile form ---
    const [profile, setProfile] = useState({
        firstName: '', lastName: '', dateOfBirth: '',
        gender: 'OTHER', contactNumber: '', address: '', emergencyContact: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- UPDATE: Add new state for the ID upload form ---
    const [governmentIdFile, setGovernmentIdFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadError, setUploadError] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    // --- PRESERVED: useEffect to fetch data is unchanged ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const data = await getMyPatientProfile();
                setProfile({
                    firstName: data.firstName || '', lastName: data.lastName || '',
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                    gender: data.gender || 'OTHER', contactNumber: data.contactNumber || '',
                    address: data.address || '', emergencyContact: data.emergencyContact || ''
                });
            } catch (err) {
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    // --- PRESERVED: Handler for main form is unchanged ---
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // --- PRESERVED: Handler for main form submission is unchanged ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
           const successMsg = await updateMyPatientProfile(profile);
            setMessage(successMsg);
            // Optionally navigate after a delay
            setTimeout(() => {
                setMessage(successMsg + " Profile saved.");
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };
    
    // --- UPDATE: Add new handler for file input ---
    const handleFileChange = (e) => {
        setGovernmentIdFile(e.target.files[0]);
    };

    // --- UPDATE: Add new handler for ID form submission ---
    const handleIdSubmit = async (e) => {
        e.preventDefault();
        setUploadMessage('');
        setUploadError('');
        if (!governmentIdFile) {
            setUploadError('Please select a file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('governmentId', governmentIdFile);
        try {
            const successMsg = await uploadPatientGovernmentId(formData);
            setUploadMessage(successMsg);
        } catch(err) {
            setUploadError(err.message);
        }
    };


    if (loading) {
        return <h2>Loading Profile...</h2>;
    }

    return (
        <div>
            {/* --- PRESERVED: The first form for profile details is unchanged --- */}
            <h2>Complete Your Personal Profile</h2>
            <p>Please provide your details to enable appointment booking.</p>
            <hr />
   {/* --- THIS IS THE CORRECTED, COMPLETE FORM --- */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input name="firstName" value={profile.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input name="lastName" value={profile.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={profile.gender} onChange={handleChange}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contactNumber" value={profile.contactNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input name="address" value={profile.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Emergency Contact (Optional)</label>
                    <input type="tel" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} />
                </div>

                {message && <p className="message success">{message}</p>}
                {error && <p className="message error">{error}</p>}
                <button type="submit" className="btn">Save Profile</button>
            </form>
            {/* --- END OF CORRECTED FORM --- */}

            {/* --- UPDATE: Add the new section and form for ID upload --- */}
            <hr style={{margin: '2rem 0'}} />

            <h3>Upload Government ID for Verification</h3>
            <p>Please upload a clear copy of a government-issued ID. This is required for account verification.</p>
            
            <form onSubmit={handleIdSubmit}>
                <div className="form-group">
                    <label>ID Document (Aadhar, Passport, Driving License)</label>
                    <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
                </div>
                {uploadMessage && <p className="message success">{uploadMessage}</p>}
                {uploadError && <p className="message error">{uploadError}</p>}
                <button type="submit" className="btn">Submit ID for Verification</button>
            </form>
        </div>
    );
};

export default PatientProfilePage;