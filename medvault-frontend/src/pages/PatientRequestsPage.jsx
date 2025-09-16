// src/pages/PatientRequestsPage.jsx
import React from 'react';
import PendingRegistrations from '../components/PendingRegistrations';

const PatientRequestsPage = () => {
  return (
    <div>
      <h2>Pending Patient Requests</h2>
      <p>Review and approve new registration requests from patients.</p>
      <hr />
      <PendingRegistrations role="ROLE_USER" />
    </div>
  );
};
export default PatientRequestsPage;