// src/services/api.js

const API_URL = 'http://localhost:8080/api';

// --- HELPER 1: For requests WITH a JSON body (POST, PUT) ---
const getAuthHeadersWithBody = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- HELPER 2: For requests WITHOUT a body (GET) ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

// --- HELPER 3: For file uploads ---
const getFileUploadHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
};


// ===================================================
// === PUBLIC FUNCTIONS (No Token Needed) ===
// ===================================================

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) { throw new Error('Login failed'); }
  return response.json();
};

export const submitRegistration = async (registrationData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData),
  });
  const responseText = await response.text();
  if (!response.ok) { throw new Error(responseText); }
  return responseText;
};

export const getAllVerifiedDoctors = async () => {
  const response = await fetch(`${API_URL}/public/doctors/verified`);
  if (!response.ok) { throw new Error('Failed to fetch doctors'); }
  return response.json();
};


// ===================================================
// === PROTECTED FUNCTIONS (Token Handled by Helpers) ===
// ===================================================

// --- SHARED ---
export const setNewPassword = async (passwords) => {
  const response = await fetch(`${API_URL}/auth/set-new-password`, {
    method: 'POST',
    headers: getAuthHeadersWithBody(),
    body: JSON.stringify(passwords),
  });
  if (!response.ok) { throw new Error('Failed to set new password'); }
  return response.json();
};

// --- DOCTOR ---
export const getMyDoctorProfile = async () => {
  const response = await fetch(`${API_URL}/doctor/profile/me`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch doctor profile'); }
  return response.json();
};

export const getMyDoctorProfileStatus = async () => {
  const response = await fetch(`${API_URL}/doctor/profile/status`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch doctor profile status'); }
  return response.json();
};

export const updateMyDoctorProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/doctor/profile/me`, {
    method: 'PUT',
    headers: getAuthHeadersWithBody(),
    body: JSON.stringify(profileData),
  });
  if (!response.ok) { throw new Error('Failed to update doctor profile'); }
  return response.text();
};

export const uploadDoctorDocuments = async (formData) => {
  const response = await fetch(`${API_URL}/doctor/profile/documents`, {
    method: 'POST',
    headers: getFileUploadHeaders(),
    body: formData,
  });
  if (!response.ok) { throw new Error('File upload failed'); }
  return response.text();
};

export const createDoctorSlots = async (slotData) => {
  const response = await fetch(`${API_URL}/doctor/slots`, {
    method: 'POST',
    headers: getAuthHeadersWithBody(),
    body: JSON.stringify(slotData),
  });
  if (!response.ok) { throw new Error('Failed to create slots'); }
  return response.text();
};

export const getAppointmentRequests = async () => {
  const response = await fetch(`${API_URL}/doctor/appointments/requests`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch appointment requests'); }
  return response.json();
};

export const approveAppointment = async (appointmentId) => {
  const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(), // No body needed, so simple headers are fine
  });
  if (!response.ok) { throw new Error('Failed to approve appointment'); }
  return response.text();
};

export const rejectAppointment = async (appointmentId) => {
  const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(), // No body needed
  });
  if (!response.ok) { throw new Error('Failed to reject appointment'); }
  return response.text();
};

// --- PATIENT ---
export const getMyPatientProfile = async () => {
    const response = await fetch(`${API_URL}/patient/profile/me`, { headers: getAuthHeaders() });
    if (!response.ok) { throw new Error('Failed to fetch patient profile'); }
    return response.json();
};

export const getMyPatientProfileStatus = async () => {
    const response = await fetch(`${API_URL}/patient/profile/status`, { headers: getAuthHeaders() });
    if (!response.ok) { throw new Error('Failed to fetch patient profile status'); }
    return response.json();
};

export const updateMyPatientProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/patient/profile/me`, {
        method: 'PUT',
        headers: getAuthHeadersWithBody(),
        body: JSON.stringify(profileData),
    });
    if (!response.ok) { throw new Error('Failed to update patient profile'); }
    return response.text();
};

export const getDoctorAvailableSlots = async (doctorId) => {
  const response = await fetch(`${API_URL}/patient/doctors/${doctorId}/slots`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch slots'); }
  return response.json();
};

export const bookAppointment = async (bookingData) => {
    const response = await fetch(`${API_URL}/patient/appointments/book`, {
        method: 'POST',
        headers: getAuthHeadersWithBody(),
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) { throw new Error('Failed to book appointment'); }
    return response.text();
};

export const getMyPatientAppointments = async () => {
    const response = await fetch(`${API_URL}/patient/my-appointments`, { headers: getAuthHeaders() });
    if (!response.ok) { throw new Error('Failed to fetch appointments'); }
    return response.json();
};

// --- ADMIN ---
export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/admin/create-user`, {
    method: 'POST',
    headers: getAuthHeadersWithBody(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) { throw new Error('Failed to create user'); }
  return response.text();
};

export const getPendingRegistrations = async (role) => {
  const response = await fetch(`${API_URL}/admin/registrations/pending?role=${role}`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch pending registrations'); }
  return response.json();
};

export const approveRegistration = async (requestId) => {
  const response = await fetch(`${API_URL}/admin/registrations/approve/${requestId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) { throw new Error('Failed to approve registration'); }
  return response.text();
};

export const getPendingVerifications = async () => {
  const response = await fetch(`${API_URL}/admin/doctors/pending-verification`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch pending verifications'); }
  return response.json();
};

export const approveDoctorVerification = async (doctorId) => {
  const response = await fetch(`${API_URL}/admin/doctors/${doctorId}/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) { throw new Error('Failed to approve doctor verification'); }
  return response.text();
};

// --- UPDATED: More flexible function to get doctor's appointments ---
export const getDoctorAppointments = async (status = '') => {
  const response = await fetch(`${API_URL}/doctor/my-appointments?status=${status}`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch appointments'); }
  return response.json();
};

// --- NEW: Mark appointment as complete ---
export const completeAppointment = async (appointmentId) => {
    const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    if (!response.ok) { throw new Error('Failed to mark appointment as complete'); }
    return response.text();
};

export const cancelAppointment = async (appointmentId) => {
    const response = await fetch(`${API_URL}/patient/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    if (!response.ok) { throw new Error('Failed to cancel appointment'); }
    return response.text();
};

// --- NEW PUBLIC FUNCTION ---
export const getPublicDoctorProfile = async (doctorId) => {
  // This endpoint is public, so no authorization header is needed.
  const response = await fetch(`${API_URL}/public/doctors/${doctorId}`);
  if (!response.ok) {
    throw new Error('Could not find doctor profile.');
  }
  return response.json();
};


// --- ADMIN: GET DASHBOARD STATS ---
export const getAdminDashboardStats = async () => {
  const response = await fetch(`${API_URL}/admin/dashboard/stats`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch dashboard stats'); }
  return response.json();
};

// --- DOCTOR: GET DASHBOARD STATS ---
export const getDoctorDashboardStats = async () => {
  const response = await fetch(`${API_URL}/doctor/dashboard/stats`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch dashboard stats'); }
  return response.json();
};

// --- PATIENT: UPLOAD GOVERNMENT ID ---
export const uploadPatientGovernmentId = async (formData) => {
  // We use getFileUploadHeaders because it correctly omits the Content-Type
  const response = await fetch(`${API_URL}/patient/profile/government-id`, {
    method: 'POST',
    headers: getFileUploadHeaders(),
    body: formData,
  });
  if (!response.ok) { throw new Error('Government ID upload failed'); }
  return response.text();
};

// --- ADMIN: GET PATIENTS PENDING VERIFICATION ---
export const getPendingPatientVerifications = async () => {
  const response = await fetch(`${API_URL}/admin/patients/pending-verification`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch pending patient verifications'); }
  return response.json();
};

// --- ADMIN: APPROVE PATIENT VERIFICATION ---
export const approvePatientVerification = async (patientId) => {
  const response = await fetch(`${API_URL}/admin/patients/${patientId}/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) { throw new Error('Failed to approve patient verification'); }
  return response.text();
};

// --- ADMIN: GET PAGINATED PATIENTS ---
export const getAllPatientsPaginated = async (page = 0, size = 10) => {
  const response = await fetch(`${API_URL}/admin/patients?page=${page}&size=${size}`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch patients'); }
  return response.json(); // Spring Page object is already valid JSON
};

// --- ADMIN: GET PAGINATED DOCTORS ---
export const getAllDoctorsPaginated = async (page = 0, size = 10) => {
  const response = await fetch(`${API_URL}/admin/doctors?page=${page}&size=${size}`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch doctors'); }
  return response.json();
};

// --- PATIENT: SUBMIT FEEDBACK ---
export const submitFeedback = async (appointmentId, feedbackData) => {
  const response = await fetch(`${API_URL}/patient/appointments/${appointmentId}/feedback`, {
    method: 'POST',
    headers: getAuthHeadersWithBody(),
    body: JSON.stringify(feedbackData),
  });
  if (!response.ok) { throw new Error('Failed to submit feedback'); }
  return response.text();
};

// --- DOCTOR: GET MY REVIEWS ---
export const getMyDoctorReviews = async () => {
  const response = await fetch(`${API_URL}/doctor/my-reviews`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch reviews'); }
  return response.json();
};

// --- ADMIN: GET ALL REVIEWS ---
export const getAllReviews = async () => {
  const response = await fetch(`${API_URL}/admin/reviews`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch reviews'); }
  return response.json();
};

// --- ADMIN: DELETE A REVIEW ---
export const deleteReview = async (ratingId) => {
  const response = await fetch(`${API_URL}/admin/reviews/${ratingId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) { throw new Error('Failed to delete review'); }
  return response.text();
};

// --- PATIENT: GET DASHBOARD STATS ---
export const getPatientDashboardStats = async () => {
  const response = await fetch(`${API_URL}/patient/dashboard/stats`, { headers: getAuthHeaders() });
  if (!response.ok) { throw new Error('Failed to fetch dashboard stats'); }
  return response.json();
};

    // --- PATIENT: REQUEST RESCHEDULE ---
    export const requestReschedule = async (appointmentId, newSlotId) => {
      const response = await fetch(`${API_URL}/patient/appointments/${appointmentId}/reschedule`, {
        method: 'POST',
        headers: getAuthHeadersWithBody(),
        body: JSON.stringify({ newSlotId }),
      });
      
      // THE FIX IS HERE:
      if (!response.ok) {
        // Read the server's response as plain text, which is what we are sending for this error.
        const errorMessage = await response.text(); 
        // Throw an error with the specific message from the backend.
        throw new Error(errorMessage || 'Failed to request reschedule'); 
      }
      
      // This part is for the SUCCESS case
      return response.text();
    };

// --- DOCTOR: APPROVE/REJECT RESCHEDULE ---
export const approveReschedule = async (appointmentId) => {
  const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/reschedule/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) { throw new Error('Failed to approve reschedule'); }
  return response.text();
};

export const rejectReschedule = async (appointmentId) => {
  const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/reschedule/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) { throw new Error('Failed to reject reschedule'); }
  return response.text();
};