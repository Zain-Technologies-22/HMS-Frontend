import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-white text-2xl font-bold cursor-pointer">HMS</span>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <span className="text-white hover:text-blue-200 cursor-pointer">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/doctors">
              <span className="text-white hover:text-blue-200 cursor-pointer">Doctors</span>
            </Link>
          </li>
          {/* Add more navigation items for other modules as you develop them */}
        </ul>
      </div>
    </nav>
  );
}