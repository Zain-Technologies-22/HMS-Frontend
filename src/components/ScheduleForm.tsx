'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ErrorMessage from './ErrorMessage';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';

interface ScheduleFormData {
  doctor: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

const initialFormData: ScheduleFormData = {
  doctor: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleForm({ doctorId }: { doctorId: string }) {
  const [formData, setFormData] = useState<ScheduleFormData>({ ...initialFormData, doctor: doctorId });
  const [formError, setFormError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['addSchedule', doctorId],
    mutationFn: (data: ScheduleFormData) =>
      axios.post(`http://localhost:7000/api/doctors/${doctorId}/add_schedule/`, {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: any }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.day_of_week || !formData.start_time || !formData.end_time) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (formData.end_time <= formData.start_time) {
      setFormError('End time must be after start time.');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">
        Add Schedule
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="day-of-week-label">Day of Week</InputLabel>
        <Select
          labelId="day-of-week-label"
          id="day_of_week"
          name="day_of_week"
          value={formData.day_of_week}
          onChange={handleInputChange}
          required
        >
          {daysOfWeek.map((day, index) => (
            <MenuItem key={index} value={index}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Start Time"
        type="time"
        id="start_time"
        name="start_time"
        value={formData.start_time}
        onChange={handleInputChange}
        required
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="End Time"
        type="time"
        id="end_time"
        name="end_time"
        value={formData.end_time}
        onChange={handleInputChange}
        required
        InputLabelProps={{ shrink: true }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Adding...' : 'Add Schedule'}
      </Button>

      {formError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {formError}
        </Typography>
      )}
      {mutation.isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {(mutation.error as any).message}
        </Typography>
      )}
    </Box>
  );
}
