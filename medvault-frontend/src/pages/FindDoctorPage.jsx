// src/pages/FindDoctorPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllVerifiedDoctors } from '../services/api';
import StarRating from '../components/StarRating'; // --- UPDATE: Import the new component ---

const FindDoctorPage = () => {
    // --- PRESERVED: Component logic is unchanged ---
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getAllVerifiedDoctors();
                setDoctors(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <h2>Loading Doctors...</h2>;

    // --- UPDATE: The JSX inside the .map() is changed below ---
    return (
        <div>
            <h2>Find a Doctor</h2>
            <p>Select a doctor to view their profile and available appointment slots.</p>
            <hr />
            <div>
                {doctors.length > 0 ? doctors.map(doctor => (
                    <div key={doctor.id} className="doctor-card">
                        {/* This div helps group the text content on the left */}
                        <div>
                            <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                            <p>{doctor.specialization}</p>
                            
                            {/* This is the new block for displaying the star rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <StarRating rating={doctor.averageRating} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    ({doctor.reviewCount} reviews)
                                </span>
                            </div>
                        </div>
                        
                        {/* This link is preserved and unchanged */}
                        <Link to={`/user/book-appointment/${doctor.id}`} className="btn">
                            View & Book
                        </Link>
                    </div>
                )) : <p>No doctors are available at this time.</p>}
            </div>
        </div>
    );
};

export default FindDoctorPage;