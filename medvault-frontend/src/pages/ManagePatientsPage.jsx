// src/pages/ManagePatientsPage.jsx

import React, { useState, useEffect } from 'react';
import { getAllPatientsPaginated } from '../services/api';
import Pagination from '../components/Pagination'; // Correctly imported

const ManagePatientsPage = () => {
    // --- UPDATE: State now holds the full page object from the backend ---
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Track the current page number
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const data = await getAllPatientsPaginated(currentPage);
                setPageData(data);
            } catch (error) {
                console.error("Failed to fetch patients:", error);
                setError("Could not load patient data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [currentPage]); // The key: this hook re-runs whenever 'currentPage' changes

    if (loading) {
        return <h2>Loading Patients...</h2>;
    }

    if (error) {
        return <p className="message error">{error}</p>;
    }

    return (
        <div>
            <h2>Manage Patients</h2>
            <p>A complete list of all registered patients in the system.</p>
            <hr />
            <table className="user-table"> {/* Added a class for styling */}
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Date Registered</th>
                    </tr>
                </thead>
                <tbody>
                    {/* We now map over pageData.content */}
                    {pageData?.content.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.email}</td>
                            <td>{patient.contactNumber || 'N/A'}</td>
                            <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- THE FIX IS HERE --- */}
            {/* The Pagination component is now OUTSIDE the table and correctly wired up */}
            <Pagination pageData={pageData} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ManagePatientsPage;