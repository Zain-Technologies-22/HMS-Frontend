// src/app/doctors/page.tsx
import dynamic from 'next/dynamic';

const DoctorsList = dynamic(() => import('./DoctorsList'), { ssr: false });

export default function DoctorsPage() {
  return <DoctorsList />;
}