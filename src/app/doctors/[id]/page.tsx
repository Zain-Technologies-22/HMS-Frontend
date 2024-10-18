import DoctorDetails from '../DoctorDetails';

export default function DoctorDetailsPage({ params }: { params: { id: string } }) {
  return <DoctorDetails id={params.id} />;
}