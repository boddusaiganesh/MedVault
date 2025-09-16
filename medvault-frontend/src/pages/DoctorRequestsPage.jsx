// src/pages/DoctorRequestsPage.jsx
import React from 'react';
import PendingRegistrations from '../components/PendingRegistrations';

const DoctorRequestsPage = () => {
  return (
    <div>
      <h2>Pending Doctor Requests</h2>
      <p>Review and approve new registration requests from doctors.</p>
      <hr />
      <PendingRegistrations role="ROLE_DOCTOR" />
    </div>
  );
};
export default DoctorRequestsPage;