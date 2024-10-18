'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="flex space-x-4">
      <Link href="/" className="hover:text-gray-300">Home</Link>
      <Link href="/about" className="hover:text-gray-300">About</Link>
      <Link href="/contact" className="hover:text-gray-300">Contact</Link>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
        </>
      ) : (
        <>
          <Link href="/login" className="hover:text-gray-300">Login</Link>
          <Link href="/register" className="hover:text-gray-300">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
