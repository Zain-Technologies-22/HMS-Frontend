// patients/PatientCard.tsx
import React from 'react';
import { deletePatient } from '/var/www/frontend/src/app/patients/api/deletePatient'; // Import deletePatient function
import { editPatient } from '/var/www/frontend/src/app/patients/api/editPatient'; // Import editPatient function

const PatientCard: React.FC<{ patient: any }> = ({ patient }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${patient.last_name}, ${patient.first_name}?`)) {
      try {
        await deletePatient(patient.id);
        // Handle successful deletion (e.g., update the patient list)
      } catch (error) {
        console.error('Error deleting patient:', error);
        // Handle deletion errors
      }
    }
  };

  const handleEdit = () => {
    // Implement logic to edit the patient (e.g., navigate to an edit form)
    console.log('Editing patient:', patient);
  };

  return (
    <div className="patient-card">
      <h3>{patient.last_name}, {patient.first_name}</h3>
      <p>ID: {patient.patient_id}</p>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone_number}</p>
      {/* Add more information as needed */}
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default PatientCard;