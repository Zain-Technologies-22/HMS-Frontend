'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, Avatar, Typography, Grid, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Doctor {
  id: number;
  doctor_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  license_number: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  address: string;
  joining_date: string;
  image: string;
}

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const API_BASE_URL = 'http://localhost:7000/api/doctors';

const fetchDoctor = async (id: string): Promise<Doctor> => {
  const response = await axios.get(`${API_BASE_URL}/doctors/${id}/`);
  return response.data;
};

const fetchSchedules = async (id: string): Promise<Schedule[]> => {
  const response = await axios.get(`${API_BASE_URL}/doctors/${id}/schedules/`);
  return response.data;
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorDetails({ id }: { id: string }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: doctor, isLoading: isLoadingDoctor, error: doctorError } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => fetchDoctor(id)
  });

  const { data: schedules, isLoading: isLoadingSchedules, error: schedulesError } = useQuery({
    queryKey: ['schedules', id],
    queryFn: () => fetchSchedules(id)
  });

  const deleteMutation = useMutation({
    mutationFn: (scheduleId: number) => 
      axios.delete(`${API_BASE_URL}/doctors/${id}/schedules/${scheduleId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', id] });
    },
  });

  const handleDeleteClick = (scheduleId: number) => {
    setScheduleToDelete(scheduleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (scheduleToDelete) {
      deleteMutation.mutate(scheduleToDelete);
    }
    setDeleteDialogOpen(false);
  };

  if (isLoadingDoctor || isLoadingSchedules) return <LoadingSpinner />;
  if (doctorError) return <ErrorMessage message={(doctorError as Error).message} />;
  if (schedulesError) return <ErrorMessage message={(schedulesError as Error).message} />;
  if (!doctor) return <Typography variant="h6">Doctor not found</Typography>;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader
          avatar={
            <Avatar src={doctor.image || '/placeholder-avatar.jpg'} alt={`${doctor.first_name} ${doctor.last_name}`} sx={{ width: 80, height: 80 }} />
          }
          title={<Typography variant="h4">{`${doctor.first_name} ${doctor.last_name}`}</Typography>}
          subheader={<Typography variant="h6">{doctor.specialization}</Typography>}
          action={
            <Link href={`/doctors/edit/${id}`} passHref>
              <Button startIcon={<EditIcon />} variant="contained" color="primary">
                Edit Doctor
              </Button>
            </Link>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>License Number:</strong> {doctor.license_number}</Typography>
              <Typography variant="body1"><strong>Contact:</strong> {doctor.phone_number}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {doctor.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Date of Birth:</strong> {doctor.date_of_birth}</Typography>
              <Typography variant="body1"><strong>Joining Date:</strong> {doctor.joining_date}</Typography>
              <Typography variant="body1"><strong>Address:</strong> {doctor.address}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader 
          title="Schedules" 
          action={
            <Link href={`/doctors/${id}/add-schedule`} passHref>
              <Button variant="contained" color="primary">Add Schedule</Button>
            </Link>
          }
        />
        <CardContent>
          {schedules && schedules.length > 0 ? (
            <Grid container spacing={2}>
              {schedules.map((schedule) => (
                <Grid item xs={12} sm={6} md={4} key={schedule.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{daysOfWeek[schedule.day_of_week]}</Typography>
                      <Typography variant="body1">{schedule.start_time} - {schedule.end_time}</Typography>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(schedule.id)}
                        className="mt-2"
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" className="text-gray-500 italic">No schedules available</Typography>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
      />
    </div>
  );
}