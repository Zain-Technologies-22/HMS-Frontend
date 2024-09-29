'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
  contact_number: string;
  license_number: string;
}

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorDetails({ id }: { id: string }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorAndSchedules = async () => {
      try {
        setLoading(true);
        const [doctorResponse, schedulesResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/doctors/doctors/${id}/`),
          axios.get(`http://localhost:8000/api/doctors/doctors/${id}/schedules/`)
        ]);
        setDoctor(doctorResponse.data);
        setSchedules(schedulesResponse.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Failed to load doctor details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndSchedules();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!doctor) return <div>No doctor found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{doctor.name}</h2>
      <p className="mb-2"><strong>Specialization:</strong> {doctor.specialization}</p>
      <p className="mb-2"><strong>Email:</strong> {doctor.email}</p>
      <p className="mb-2"><strong>Contact:</strong> {doctor.contact_number}</p>
      <p className="mb-4"><strong>License Number:</strong> {doctor.license_number}</p>

      <h3 className="text-xl font-semibold mb-2">Schedule</h3>
      {schedules.length > 0 ? (
        <ul className="list-disc pl-5">
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              {daysOfWeek[schedule.day_of_week]}: {schedule.start_time} - {schedule.end_time}
            </li>
          ))}
        </ul>
      ) : (
        <p>No schedules available</p>
      )}
    </div>
  );
}