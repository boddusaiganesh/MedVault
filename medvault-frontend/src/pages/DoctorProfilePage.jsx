// src/pages/DoctorProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- UPDATE: Import the new API function we will create next ---
import { getMyDoctorProfile, updateMyDoctorProfile, uploadDoctorDocuments } from '../services/api'; 
import { useAuth } from '../context/AuthContext';

const DoctorProfilePage = () => {
    // --- PRESERVED: All state for the profile form is unchanged ---
    const [profile, setProfile] = useState({
        firstName: '', lastName: '', specialization: '',
        qualification: '', contactNumber: '', experienceYears: 0,
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // --- UPDATE: Add new state for the file upload form ---
    const [medicalDegreeFile, setMedicalDegreeFile] = useState(null);
    const [medicalLicenseFile, setMedicalLicenseFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadError, setUploadError] = useState('');
    
    const { user } = useAuth();
    const navigate = useNavigate();

    // --- PRESERVED: useEffect to fetch profile data is unchanged ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.token) return;
            try {
                const data = await getMyDoctorProfile();
                setProfile({
                    firstName: data.firstName || '', lastName: data.lastName || '',
                    specialization: data.specialization || '', qualification: data.qualification || '',
                    contactNumber: data.contactNumber || '', experienceYears: data.experienceYears || 0,
                });
            } catch (err) {
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    // --- PRESERVED: Handler for profile form inputs is unchanged ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: name === 'experienceYears' ? parseInt(value) || 0 : value,
        }));
    };

    // --- PRESERVED: Handler for profile form submission is unchanged ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
           const successMsg = await updateMyDoctorProfile(profile);
            setMessage(successMsg);
        } catch (err) {
            setError(err.message);
        }
    };

    // --- UPDATE: Add new handler for file selection ---
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'medicalDegree') {
            setMedicalDegreeFile(files[0]);
        } else if (name === 'medicalLicense') {
            setMedicalLicenseFile(files[0]);
        }
    };

    // --- UPDATE: Add new handler for the document form submission ---
    const handleDocumentSubmit = async (e) => {
        e.preventDefault();
        setUploadMessage('');
        setUploadError('');

        if (!medicalDegreeFile || !medicalLicenseFile) {
            setUploadError('Please select both required document files.');
            return;
        }

        const formData = new FormData();
        formData.append('medicalDegree', medicalDegreeFile);
        formData.append('medicalLicense', medicalLicenseFile);
        
        try {
            const successMsg = await uploadDoctorDocuments(formData);
            setUploadMessage(successMsg);
        } catch(err) {
            setUploadError(err.message);
        }
    };

    if (loading) {
        return <h2>Loading Profile...</h2>;
    }

    // --- THE FIX IS IN THE JSX RETURNED BELOW ---
    return (
        <div>
            <h2>Complete Your Professional Profile</h2>
            <p>Please fill out your details to enable all features, including creating appointment slots.</p>
            <hr />
            
            {/* --- This first form for profile details is correct --- */}
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
                    <label>Specialization (e.g., Cardiology)</label>
                    <input name="specialization" value={profile.specialization} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Qualification (e.g., MBBS, MD)</label>
                    <input name="qualification" value={profile.qualification} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contact Number</label>
                    <input name="contactNumber" value={profile.contactNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Years of Experience</label>
                    <input type="number" name="experienceYears" value={profile.experienceYears} onChange={handleChange} required />
                </div>
                {message && <p className="message success">{message}</p>}
                {error && <p className="message error">{error}</p>}
                <button type="submit" className="btn">Save Profile Details</button>
            </form>

            <hr style={{margin: '2rem 0'}} />
            
            <h3>Upload Verification Documents</h3>
            <p>After saving your details, please upload your documents for admin verification.</p>
            
            {/* --- THIS IS THE CORRECTED SECOND FORM --- */}
            <form onSubmit={handleDocumentSubmit}>
                <div className="form-group">
                    <label>Medical Degree Certificate (PDF/JPEG)</label>
                    <input type="file" name="medicalDegree" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg" required />
                </div>
                 <div className="form-group">
                    <label>Medical License / Registration (PDF/JPEG)</label>
                    <input type="file" name="medicalLicense" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg" required />
                </div>
                {uploadMessage && <p className="message success">{uploadMessage}</p>}
                {uploadError && <p className="message error">{uploadError}</p>}
                <button type="submit" className="btn">Submit Documents for Verification</button>
            </form>
        </div>
    );
};

export default DoctorProfilePage;