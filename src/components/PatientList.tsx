"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { fetchPatients, deletePatient } from '../app/patients/api/patients';
import Link from 'next/link';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ThemeRegistry  from '../app/ThemeRegistry';


// Create a client
const queryClient = new QueryClient();

const PatientListContent = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(['patients', page, searchTerm], () => fetchPatients(page, searchTerm), {
    keepPreviousData: true,
    staleTime: 5000,
  });

  const deleteMutation = useMutation(deletePatient, {
    onSuccess: () => {
      queryClient.invalidateQueries('patients');
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      deleteMutation.mutate(patientToDelete.id);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient List</h1>
      <div className="mb-4">
        <TextField
          label="Search patients"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs"
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        {(data?.results || []).map((patient) => (
    <TableRow key={patient.id}>
      <TableCell>{`${patient.first_name} ${patient.last_name}`}</TableCell>
      <TableCell>{patient.date_of_birth}</TableCell>
      <TableCell>{patient.gender}</TableCell>
      <TableCell>
        <Link href={`/patients/patients/${patient.id}`} passHref>
          <Button variant="outlined" className="mr-2">View</Button>
        </Link>
        <Link href={`/patients/patients/${patient.id}/edit`} passHref>
          <Button variant="outlined" className="mr-2">Edit</Button>
        </Link>
        <Button variant="outlined" color="error" onClick={() => handleDeleteClick(patient)}>Delete</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>
      <div className="mt-4 flex justify-between">
        <Button 
          variant="contained" 
          disabled={page === 1} 
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Button 
          variant="contained" 
          disabled={!data?.next} 
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </Button>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this patient? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const PatientList = () => {
  return (
    <ThemeRegistry>
      <QueryClientProvider client={queryClient}>
        <PatientListContent />
      </QueryClientProvider>
    </ThemeRegistry>
  );
};

export default PatientList;