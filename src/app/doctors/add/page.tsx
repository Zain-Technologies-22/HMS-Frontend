'use client';

import DoctorForm from '../../../components/DoctorForm';
import { useRouter } from 'next/navigation';

export default function AddDoctorPage() {
  const router = useRouter();

  const handleSubmitSuccess = () => {
    router.push('/doctors');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Add New Doctor</h1>
      <DoctorForm onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
}