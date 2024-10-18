import nextDynamic from 'next/dynamic';  // Renamed dynamic to nextDynamic to avoid conflict
import { Suspense } from 'react';

// Keep the export named as 'dynamic' to match Next.js requirements
export const dynamic = 'force-dynamic';

const AddDoctorContent = nextDynamic(() => import('./AddDoctorPageContent'), { 
  ssr: false,
  loading: () => <p>Loading...</p>
});

const AddDoctorPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddDoctorContent />
    </Suspense>
  );
};

export default AddDoctorPage;
