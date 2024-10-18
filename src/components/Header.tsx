'use client';

import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/app/contexts/AuthContext';

const Header: React.FC = () => {
  const { isLoggedIn, username } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Zango Mediclinic</h1>
        <div className="flex items-center space-x-6">
          <Navbar />
          {isLoggedIn && (
            <span className="text-sm">Hello, <b>{username}</b>!</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
