// src/services/api.js

const API_URL = 'http://localhost:8080/api';

// --- LOGIN ---
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  // If the response is NOT okay, handle the error first
  if (!response.ok) {
    // Try to get a text message from the body, but default to the status text
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  // Only try to parse JSON if the response was successful (2xx status)
  return response.json();
};

// --- SET NEW PASSWORD ---
export const setNewPassword = async (passwords, token) => {
  const response = await fetch(`${API_URL}/auth/set-new-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(passwords),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API call failed with status ${response.status}`);
  }
  return data;
};

// --- ADMIN: CREATE USER ---
export const createUser = async (userData, token) => {
  const response = await fetch(`${API_URL}/admin/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(responseText || `API call failed with status ${response.status}`);
  }
  return responseText;
};



export const getMyPatientProfile = async (token) => {
  const response = await fetch(`${API_URL}/patient/profile/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }
  return data;
};


export const getMyDoctorProfile = async (token) => {
  const response = await fetch(`${API_URL}/doctor/profile/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }
  return data;
};