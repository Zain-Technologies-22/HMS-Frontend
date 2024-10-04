'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient,  UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

interface DoctorFormProps {
  doctorId?: string;
  onSubmitSuccess: () => void;
}

interface DoctorFormData {
  name: string;
  specialization: string;
  license_number: string;
  contact_number: string;
  email: string;
  date_of_birth: string;
  address: string;
  joining_date: string;
}

const initialFormData: DoctorFormData = {
  name: '',
  specialization: '',
  license_number: '',
  contact_number: '',
  email: '',
  date_of_birth: '',
  address: '',
  joining_date: '',
};

const fetchDoctor = async (id: string): Promise<DoctorFormData> => {
  const response = await axios.get(`http://localhost:7000/api/doctors/doctors/${id}/`);
  return response.data;
};

const DoctorForm: React.FC<DoctorFormProps> = ({ doctorId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState<DoctorFormData>(initialFormData);
  const queryClient = useQueryClient();

  const { data: doctorData, isLoading: isLoadingDoctor, error: doctorError } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => fetchDoctor(doctorId!),
    enabled: !!doctorId,
  });

  useEffect(() => {
    if (doctorData) {
      setFormData(doctorData);
    }
  }, [doctorData]);

  const mutation = useMutation<any, Error, DoctorFormData>({
    mutationFn: (data: DoctorFormData) =>
      doctorId
        ? axios.put(`http://localhost:7000/api/doctors/doctors/${doctorId}/`, data)
        : axios.post('http://localhost:7000/api/doctors/doctors/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      onSubmitSuccess();
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoadingDoctor) return <LoadingSpinner />;
  if (doctorError) return <ErrorMessage message={doctorError.message} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">License Number</label>
        <input
          type="text"
          id="license_number"
          name="license_number"
          value={formData.license_number}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
        <input
          type="tel"
          id="contact_number"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          id="date_of_birth"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>
      <div>
        <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700">Joining Date</label>
        <input
          type="date"
          id="joining_date"
          name="joining_date"
          value={formData.joining_date}
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
  {mutation.isPending ? 'Submitting...' : (doctorId ? 'Update Doctor' : 'Add Doctor')}
</button>
      </div>
      {mutation.isError && <ErrorMessage message={(mutation.error as Error).message} />}
    </form>
  );
};

export default DoctorForm;
