'use client';

import ScheduleForm from '../../../../components/ScheduleForm';
import Link from 'next/link';

export default function AddSchedulePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Add Schedule</h1>
        <Link href={`/doctors/${params.id}`}>
          <span className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Back to Doctor
          </span>
        </Link>
      </div>
      <ScheduleForm doctorId={params.id} />
    </div>
  );
}