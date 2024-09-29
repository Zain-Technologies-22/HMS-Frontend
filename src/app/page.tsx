import './globals.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Hospital Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Doctors" description="Manage doctors and their schedules" link="/doctors" />
        {/* Add more cards for other modules as you develop them */}
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <Link href={link}>
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}