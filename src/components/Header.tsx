// components/Header.tsx
import React from 'react';
import Navbar from './Navbar'; // Importing Navbar

const Header = () => (
  <header className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Zango Mediclinic</h1>
      <Navbar /> {/* Using the Navbar component here */}
    </div>
  </header>
);

export default Header;
