
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ErrorMessage from './ErrorMessage';

interface ScheduleFormData {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

const initialFormData: ScheduleFormData = {
  day_of_week: '',
  start_time: '',
  end_time: '',
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleForm({ doctorId }: { doctorId: string }) {
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['addSchedule', doctorId],  // <-- Define mutationKey here
    mutationFn: (data: ScheduleFormData) =>
      axios.post(`http://localhost:7000/api/doctors/doctors/${doctorId}/add_schedule/`, {
        ...data,
        day_of_week: parseInt(data.day_of_week),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', doctorId] });
      router.push(`/doctors/${doctorId}`);
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.detail || 'An error occurred while adding the schedule.');
    },
  });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
  
      // Basic form validation
      if (!formData.day_of_week || !formData.start_time || !formData.end_time) {
        setFormError('Please fill in all fields.');
        return;
      }
    
  
      // Check if end time is after start time
      if (formData.end_time <= formData.start_time) {
        setFormError('End time must be after start time.');
        return;
      }
    
      mutation.mutate(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">Day of Week</label>
          <select
            id="day_of_week"
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a day</option>
            {daysOfWeek.map((day, index) => (
              <option key={day} value={index}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
        <button
  type="submit"
  disabled={mutation.isPending}
  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
  {mutation.isPending ? 'Adding...' : 'Add Schedule'}
</button>
        </div>
        {formError && <ErrorMessage message={formError} />}
      {mutation.isError && <ErrorMessage message={(mutation.error as any).message} />}
    </form>
  );
}