'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Grid } from '@mui/material';
import Image from 'next/image';

interface DoctorFormProps {
  doctorId?: string;
  onSubmitSuccess: () => void;
}

interface DoctorFormData {
  first_name: string;
  last_name: string;
  specialization: string;
  license_number: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  address: string;
  image?: File | null;
  joining_date: string;
  is_active: boolean;
}

const initialFormData: DoctorFormData = {
  first_name: '',
  last_name: '',
  specialization: '',
  license_number: '',
  phone_number: '',
  email: '',
  date_of_birth: '',
  address: '',
  image: null,
  joining_date: '',
  is_active: true,
};

const fetchDoctor = async (id: string): Promise<DoctorFormData> => {
  const response = await axios.get(`http://localhost:7000/api/doctors/doctors/${id}/`);
  return response.data;
};

const DoctorForm: React.FC<DoctorFormProps> = ({ doctorId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState<DoctorFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: doctorData, isLoading: isLoadingDoctor, error: doctorError } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => fetchDoctor(doctorId!),
    enabled: !!doctorId,
  });

  useEffect(() => {
    if (doctorData) {
      setFormData(doctorData);
      if (doctorData.image) setImagePreview(doctorData.image as unknown as string);
    }
  }, [doctorData]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      doctorId
        ? axios.put(`http://localhost:7000/api/doctors/doctors/${doctorId}/`, data)
        : axios.post('http://localhost:7000/api/doctors/doctors/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      onSubmitSuccess();
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, image: file }));
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) formDataToSend.append(key, value as any);
    });
    mutation.mutate(formDataToSend);
  };

  if (isLoadingDoctor) return <LoadingSpinner />;
  if (doctorError) return <ErrorMessage message={doctorError.message} />;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="License Number"
            name="license_number"
            value={formData.license_number}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Joining Date"
            name="joining_date"
            type="date"
            value={formData.joining_date}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_active}
                onChange={handleInputChange}
                name="is_active"
              />
            }
            label="Is Active"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Upload Image</Typography>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <Image src={imagePreview} alt="Preview" width={100} height={100} />}
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isLoading}
            fullWidth
          >
            {mutation.isLoading ? 'Submitting...' : doctorId ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </Grid>
        {mutation.isError && <ErrorMessage message={(mutation.error as Error).message} />}
      </Grid>
    </form>
  );
};

export default DoctorForm;
