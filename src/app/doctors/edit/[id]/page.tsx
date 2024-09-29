'use client';

import DoctorForm from '../../../../components/DoctorForm';
import { useRouter } from 'next/navigation';

export default function EditDoctorPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleSubmitSuccess = () => {
    router.push(`/doctors/${params.id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Doctor</h1>
      <DoctorForm doctorId={params.id} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
}