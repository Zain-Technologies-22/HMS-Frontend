import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
        <li><Link href="/doctors" className="hover:text-gray-300">Doctors</Link></li>
        <li><Link href="/patients" className="hover:text-gray-300">Patients</Link></li>
        <li><Link href="/diagnostics" className="hover:text-gray-300">Diagnostics</Link></li>
        <li><Link href="/radiologies" className="hover:text-gray-300">Radiologies</Link></li>
        <li><Link href="/nurse" className="hover:text-gray-300">Nurse</Link></li>
        <li><Link href="/admin" className="hover:text-gray-300">Admin</Link></li>
        <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
        <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
        <li><Link href="/login" className="hover:text-blue-200">Login</Link></li>
        <li><Link href="/register" className="hover:text-blue-200">Register</Link></li>
      </ul>
      </div>
    </nav>
  );
};

export default Navbar;
