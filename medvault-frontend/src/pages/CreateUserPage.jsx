// src/pages/CreateUserPage.jsx
import React from 'react';
import CreateUserForm from '../components/CreateUserForm';

const CreateUserPage = () => {
  return (
    <div>
      <h2>Create New User Directly</h2>
      <p>Use this form to bypass the approval process and create a user immediately.</p>
      <hr />
      <CreateUserForm />
    </div>
  );
};
export default CreateUserPage;