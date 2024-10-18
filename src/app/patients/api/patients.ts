// src/app/api/patients.ts

import axios from 'axios';

const API_URL = 'http://localhost:7000/api/patients/patients/';

export const fetchPatients = async (page = 1, search = '') => {
  const response = await axios.get(`${API_URL}?page=${page}&search=${search}`);
  return response.data;
};

export const fetchPatient = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}/`);
  return response.data;
};

export const createPatient = async (patientData: any) => {
  const response = await axios.post(API_URL, patientData);
  return response.data;
};

export const updatePatient = async (id: string, patientData: any) => {
  const response = await axios.put(`${API_URL}/${id}/`, patientData);
  return response.data;
};

export const deletePatient = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}/`);
  return response.data;
};