// components/LandingPage.tsx
'use client';

import React from 'react';
import Module from './Module';
import { useAuth } from '../app/contexts/AuthContext';
import { Users, Stethoscope, Clipboard, UserPlus, Lock } from 'lucide-react';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const modules = [
    {
      title: 'Patient Management',
      description: 'Efficiently manage patient records, appointments, and medical history.',
      icon: Users,
      linkHref: '/patients',
    },
    {
      title: 'Doctor Portal',
      description: 'Access patient information, update treatments, and manage schedules.',
      icon: Stethoscope,
      linkHref: '/doctors',
    },
    {
      title: 'Nurse Station',
      description: 'Monitor patient vitals, manage care plans, and coordinate with doctors.',
      icon: Clipboard,
      linkHref: '/nurse',
    },
    {
      title: 'Admin Dashboard',
      description: 'Oversee system operations, manage user accounts, and generate reports.',
      icon: UserPlus,
      linkHref: '/admin',
    },
    {
      title: 'Billing',
      description: 'Handle patient billing and generate invoices.',
      icon: Lock,
      linkHref: '/billing',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Zango Mediclinic</h2>
        <p className="text-xl text-gray-600">Your comprehensive healthcare management solution</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Module key={module.linkHref} {...module} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </section>

      {!isLoggedIn && (
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Get Started</h2>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Login Now
          </Link>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
