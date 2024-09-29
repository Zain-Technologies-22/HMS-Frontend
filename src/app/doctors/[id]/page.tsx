'use client';

import DoctorDetails from '../../../components/DoctorDetails';

export default function DoctorPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Doctor Details</h1>
      <DoctorDetails id={params.id} />
    </div>
  );
}