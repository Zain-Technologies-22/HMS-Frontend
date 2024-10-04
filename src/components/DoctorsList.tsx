'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ConfirmationDialog from './ConfirmationDialog';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
}

const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await axios.get('http://localhost:7000/api/doctors/doctors/');
  console.log('API response:', response.data); // Debug log
  return response.data;
};

export default function DoctorsList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  console.log('Doctors data:', doctors); // Debug log

  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`http://localhost:7000/api/doctors/doctors/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      alert('Doctor deleted successfully!'); // Feedback for deletion success
    },
    onError: (error) => {
      alert('Failed to delete doctor: ' + (error as Error).message);
    },
  });

  const handleDeleteClick = (id: number) => {
    setDoctorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (doctorToDelete !== null) {
      deleteMutation.mutate(doctorToDelete);
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={(error as Error).message} />;

  if (!doctors || !Array.isArray(doctors)) {
    console.error('Doctors data is not an array:', doctors);
    return <div>No doctors data available</div>;
  }

  return (
    <div>
      <ul className="space-y-4">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <Link href={`/doctors/${doctor.id}`}>
                  <span className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                    {doctor.name}
                  </span>
                </Link>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-500">{doctor.email}</p>
              </div>
              <div className="space-x-2">
                <Link href={`/doctors/edit/${doctor.id}`}>
                  <span className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    Edit
                  </span>
                </Link>
                <button
                  onClick={() => handleDeleteClick(doctor.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        message="Are you sure you want to delete this doctor? This action cannot be undone."
      />
    </div>
  );
}
