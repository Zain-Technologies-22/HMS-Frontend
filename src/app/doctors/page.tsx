import React from 'react';
import DoctorsList from '../../components/DoctorsList';

const DoctorsPage = () => {
  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Doctors</h1>
        <DoctorsList />
      </main>
    </>
  );
};

export default DoctorsPage;