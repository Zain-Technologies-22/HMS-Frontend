'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import ConfirmationDialog from './ConfirmationDialog';


interface Doctor {
  id: number;
  name: string;
  specialization: string;
  license_number: string;
  contact_number: string;
  email: string;
  date_of_birth: string;
  address: string;
  joining_date: string;
}

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fetchDoctor = async (id: string): Promise<Doctor> => {
  const response = await axios.get(`http://localhost:7000/api/doctors/doctors/${id}/`);
  return response.data;
};

const fetchSchedules = async (id: string): Promise<Schedule[]> => {
  const response = await axios.get(`http://localhost:7000/api/doctors/doctors/${id}/schedules/`);
  return response.data;
};

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
      axios.delete(`http://localhost:7000/api/doctors/doctors/${id}/schedules/${scheduleId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', id] });
    },
  });  const handleDeleteClick = (scheduleId: number) => {
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
  if (doctorError) return <ErrorMessage message={doctorError.message} />;
  if (schedulesError) return <ErrorMessage message={schedulesError.message} />;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{doctor.name}</h2>
        <Link href={`/doctors/edit/${id}`}>
          <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Edit Doctor
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>License Number:</strong> {doctor.license_number}</p>
        <p><strong>Contact:</strong> {doctor.contact_number}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Date of Birth:</strong> {doctor.date_of_birth}</p>
        <p><strong>Joining Date:</strong> {doctor.joining_date}</p>
      </div>
      <p className="mb-4"><strong>Address:</strong> {doctor.address}</p>

      <h3 className="text-xl font-semibold mb-2">Schedules</h3>
      {schedules && schedules.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {schedules.map((schedule) => (
            <li key={schedule.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>
                {daysOfWeek[schedule.day_of_week]}: {schedule.start_time} - {schedule.end_time}
              </span>
              <button
                onClick={() => handleDeleteClick(schedule.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-gray-500 italic">No schedules available</p>
      )}

      <Link href={`/doctors/${id}/add-schedule`}>
        <span className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          Add Schedule
        </span>
      </Link>

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