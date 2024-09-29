import Link from 'next/link';

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li>
            <Link href="/doctors">
              <span className="text-blue-600 hover:text-blue-800">All Doctors</span>
            </Link>
          </li>
          <li>
            <Link href="/doctors/add">
              <span className="text-blue-600 hover:text-blue-800">Add Doctor</span>
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}