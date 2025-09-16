// src/pages/ManageDoctorsPage.jsx

import React, { useState, useEffect } from 'react';
// --- PRESERVED: Imports are correct ---
import { getAllDoctorsPaginated } from '../services/api'; 
import Pagination from '../components/Pagination';

const ManageDoctorsPage = () => {
    // --- PRESERVED: State management is correct ---
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- PRESERVED: Data fetching logic is correct ---
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getAllDoctorsPaginated(currentPage);
                setPageData(data);
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
                setError('Could not load doctor data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [currentPage]);

    // --- PRESERVED: Loading and error handling is correct ---
    if (loading) {
        return <h2>Loading Doctors...</h2>;
    }

    if (error) {
        return <p className="message error">{error}</p>;
    }

    // --- UPDATE: The JSX is now correctly structured ---
    return (
        <div>
            <h2>Manage Doctors</h2>
            <p>A complete list of all registered doctors in the system.</p>
            <hr />
            
            {/* 1. Added className for styling */}
            <table className="user-table"> 
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Date Registered</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Simplified check for content */}
                    {pageData?.content.map(doctor => (
                        <tr key={doctor.id}>
                            {/* Added "Dr. " prefix for professionalism */}
                            <td>Dr. {doctor.name}</td>
                            <td>{doctor.email}</td>
                            <td>{doctor.contactNumber || 'N/A'}</td>
                            <td>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* A message to show if the table is empty */}
            {pageData?.content.length === 0 && (
                <p style={{ textAlign: 'center', padding: '2rem' }}>No doctors found.</p>
            )}
            
            {/* 2. Moved Pagination component outside the table */}
            <Pagination pageData={pageData} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ManageDoctorsPage;