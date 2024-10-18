'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Doctor {
  id: number;
  doctor_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  email: string;
  image: string;
}

const API_BASE_URL = 'http://localhost:7000/api/doctors';

const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await axios.get(`${API_BASE_URL}/doctors/`);
  return response.data;
};

export default function DoctorList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`${API_BASE_URL}/doctors/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader
              avatar={
                <Avatar src={doctor.image || '/placeholder-avatar.jpg'} alt={`${doctor.first_name} ${doctor.last_name}`} />
              }
              title={`${doctor.first_name} ${doctor.last_name}`}
              subheader={doctor.specialization}
            />
            <CardContent>
              <p className="text-gray-600 mb-2">{doctor.email}</p>
              <p className="text-gray-500 mb-4">ID: {doctor.doctor_id}</p>
              <div className="flex justify-between">
                <Link href={`/doctors/${doctor.id}`} passHref>
                  <Button variant="contained" color="primary">View Profile</Button>
                </Link>
                <div>
                  <Link href={`/doctors/edit/${doctor.id}`} passHref>
                    <Button startIcon={<EditIcon />} variant="outlined" color="primary" className="mr-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteClick(doctor.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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